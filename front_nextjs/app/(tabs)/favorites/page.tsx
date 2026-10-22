"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Heart, Loader2, Scissors, Store, User } from "lucide-react";
import { getFavorites } from "@/api/favorite/getFavorites";
import { useUpdateFavorites } from "@/hooks/favorite/useUpdateFavorites";
import { FavoriteData } from "@/types/favorite/FavoriteData";

export default function FavoritesScreen() {
  const [favoriteSalon, setFavoriteSalon] = useState("");
  const [favoriteDesigner, setFavoriteDesigner] = useState("");
  const [favoriteMenu, setFavoriteMenu] = useState("");

  /////////////////////////////////////////////////////////////////////

  const { data, isPending, isError, refetch } = useQuery<FavoriteData>({
    queryKey: ["favorites"],
    queryFn: getFavorites,
  });

  useEffect(() => {
    if (data) {
      setFavoriteSalon(data.favorite_salon || "");
      setFavoriteDesigner(data.favorite_designer || "");
      setFavoriteMenu(data.favorite_menu || "");
    }
  }, [data]);

  /////////////////////////////////////////////////////////////////////

  const { mutate: favUpdateMutation, isPending: favUpdatePending } =
    useUpdateFavorites();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    favUpdateMutation({
      favorite_salon: favoriteSalon.trim(),
      favorite_designer: favoriteDesigner.trim(),
      favorite_menu: favoriteMenu.trim(),
    });
  };

  /////////////////////////////////////////////////////////////////////

  return (
    <main className="flex-1 w-full min-h-screen bg-blue-50 flex flex-col items-center py-6 px-4 pb-28">
      <div className="max-w-xl w-full">
        {/* 헤더 섹션 */}
        <header className="mb-5">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Heart className="w-6 h-6 text-[#00c05a]" />
            <h1 className="text-[21px] font-bold text-gray-900 tracking-tight">
              나의 즐겨찾기
            </h1>
          </div>
          <p className="text-sm text-gray-500 leading-snug">
            즐겨찾기를 설정하면 기본 예약 정보로 등록돼요.
          </p>
        </header>

        {/* 상태별 콘텐츠 영역 */}
        {isPending ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-sm text-gray-500">선호 정보를 불러오는 중...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-center">
            <p className="text-sm text-gray-500">정보를 불러오지 못했습니다.</p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors"
            >
              다시 시도
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSave}
            className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
          >
            {/* 단골 미용실 */}
            <label className="block text-[13px] font-semibold text-gray-500 mt-3 mb-1.5">
              단골 미용실
            </label>
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3.5 focus-within:ring-1 focus-within:ring-green-400  transition-all">
              <Store className="w-4 h-4 text-gray-400 mr-2.5 shrink-0" />
              <input
                type="text"
                className="w-full py-3 text-[15px] text-gray-900 bg-transparent focus:outline-none placeholder:text-gray-400"
                value={favoriteSalon}
                onChange={(e) => setFavoriteSalon(e.target.value)}
                placeholder="미용실 이름을 입력해주세요"
              />
            </div>

            {/* 선호 디자이너 */}
            <label className="block text-[13px] font-semibold text-gray-500 mt-4 mb-1.5">
              선호 디자이너
            </label>
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3.5 focus-within:ring-1 focus-within:ring-green-400  transition-all">
              <User className="w-4 h-4 text-gray-400 mr-2.5 shrink-0" />
              <input
                type="text"
                className="w-full py-3 text-[15px] text-gray-900 bg-transparent focus:outline-none placeholder:text-gray-400"
                value={favoriteDesigner}
                onChange={(e) => setFavoriteDesigner(e.target.value)}
                placeholder="디자이너 이름을 입력해주세요."
              />
            </div>

            {/* 자주 받는 시술 메뉴 */}
            <label className="block text-[13px] font-semibold text-gray-500 mt-4 mb-1.5">
              자주 받는 시술 메뉴
            </label>
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3.5 focus-within:ring-1 focus-within:ring-green-400  transition-all">
              <Scissors className="w-4 h-4 text-gray-400 mr-2.5 shrink-0" />
              <input
                type="text"
                className="w-full py-3 text-[15px] text-gray-900 bg-transparent focus:outline-none placeholder:text-gray-400"
                value={favoriteMenu}
                onChange={(e) => setFavoriteMenu(e.target.value)}
                placeholder="시술 메뉴 이름을 입력해주세요."
              />
            </div>

            {/* 저장 버튼 */}
            <button
              type="submit"
              disabled={favUpdatePending}
              className="cursor-pointer w-full mt-6 bg-[#00c05a] hover:bg-green-600 active:bg-blue-800 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center disabled:opacity-50"
            >
              {favUpdatePending ? (
                <Loader2 className="w-5 h-5 animate-spin text-white" />
              ) : (
                "즐겨찾기 저장하기"
              )}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
