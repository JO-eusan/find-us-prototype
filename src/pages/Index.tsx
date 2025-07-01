
import React, { useState } from 'react';
import { Search, Plus, MapPin, Calendar, User, Bell } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// 모킹 데이터
const mockLostItems = [
  {
    id: 1,
    title: "아이폰 14 Pro (퍼플)",
    category: "전자기기",
    location: "강남역 2번 출구",
    date: "2024-06-30",
    status: "습득 보관중",
    description: "퍼플색 아이폰 14 Pro, 투명 케이스 착용",
    contact: "010-1234-****"
  },
  {
    id: 2,
    title: "검은색 가죽 지갑",
    category: "지갑/가방",
    location: "송파구 잠실역 롯데월드몰",
    date: "2024-06-29",
    status: "습득 보관중",
    description: "검은색 가죽 지갑, 신분증과 카드 다수 포함",
    contact: "010-5678-****"
  },
  {
    id: 3,
    title: "실버 팔찌 (하트 참)",
    category: "액세서리",
    location: "강남구 신사역 가로수길",
    date: "2024-06-28",
    status: "주인 찾음",
    description: "실버 체인 팔찌, 작은 하트 참 달려있음",
    contact: "010-9012-****"
  },
  {
    id: 4,
    title: "에어팟 프로 (화이트)",
    category: "전자기기",
    location: "송파구 석촌호수 둘레길",
    date: "2024-06-27",
    status: "습득 보관중",
    description: "화이트 에어팟 프로, 케이스만 있음",
    contact: "010-3456-****"
  },
  {
    id: 5,
    title: "베이지 크로스백",
    category: "지갑/가방",
    location: "강남구 압구정로데오역",
    date: "2024-06-26",
    status: "경찰서 이관",
    description: "베이지색 작은 크로스백, 골드 체인",
    contact: "강남경찰서"
  }
];

const locations = ["강남구", "송파구", "서초구", "마포구", "종로구"];
const categories = ["전자기기", "지갑/가방", "액세서리", "의류", "기타"];

const Index = () => {
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredItems, setFilteredItems] = useState(mockLostItems);
  const [activeTab, setActiveTab] = useState("search");

  const handleLocationToggle = (location: string) => {
    setSelectedLocations(prev => 
      prev.includes(location) 
        ? prev.filter(l => l !== location)
        : [...prev, location]
    );
  };

  const handleSearch = () => {
    let filtered = mockLostItems;
    
    if (selectedLocations.length > 0) {
      filtered = filtered.filter(item => 
        selectedLocations.some(loc => item.location.includes(loc))
      );
    }
    
    if (searchKeyword) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        item.description.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }
    
    setFilteredItems(filtered);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "습득 보관중": return "bg-blue-100 text-blue-800";
      case "주인 찾음": return "bg-green-100 text-green-800";
      case "경찰서 이관": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-background font-pretendard">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">FindUs</h1>
              <span className="text-sm text-gray-500">분실물 통합 찾기 서비스</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                알림설정
              </Button>
              <Button size="sm" className="bg-gray-900 hover:bg-gray-800">
                <Plus className="w-4 h-4 mr-2" />
                분실물 등록
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="search">분실물 찾기</TabsTrigger>
            <TabsTrigger value="register">분실물 등록</TabsTrigger>
            <TabsTrigger value="manage">관리자</TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-6">
            {/* Search Section */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Search className="w-5 h-5 mr-2" />
                  방문 장소 기반 분실물 검색
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Location Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    방문했던 장소를 선택해주세요
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {locations.map((location) => (
                      <button
                        key={location}
                        onClick={() => handleLocationToggle(location)}
                        className={`px-4 py-2 rounded-full text-sm transition-colors ${
                          selectedLocations.includes(location)
                            ? 'bg-gray-900 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <MapPin className="w-3 h-3 inline mr-1" />
                        {location}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search Input */}
                <div className="flex space-x-3">
                  <Input
                    placeholder="분실물 키워드를 입력하세요 (예: 아이폰, 지갑, 팔찌)"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleSearch} className="bg-gray-900 hover:bg-gray-800">
                    <Search className="w-4 h-4 mr-2" />
                    검색
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  검색 결과 ({filteredItems.length}개)
                </h2>
                <span className="text-sm text-gray-500">최신순 정렬</span>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredItems.map((item) => (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-gray-900 line-clamp-1">
                            {item.title}
                          </h3>
                          <Badge className={getStatusBadgeColor(item.status)}>
                            {item.status}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {item.description}
                        </p>
                        
                        <div className="space-y-2 text-xs text-gray-500">
                          <div className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {item.location}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {item.date}
                          </div>
                        </div>
                        
                        <div className="pt-3 border-t">
                          <Button variant="outline" size="sm" className="w-full">
                            연락하기
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredItems.length === 0 && (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    검색 결과가 없습니다
                  </h3>
                  <p className="text-gray-500 mb-4">
                    다른 키워드나 장소로 다시 검색해보세요
                  </p>
                  <Button variant="outline">
                    <Bell className="w-4 h-4 mr-2" />
                    알림 설정하기
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="register" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>분실물 등록하기</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-12 text-gray-500">
                  분실물 등록 기능은 개발 중입니다.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>관리자 모니터링</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-12 text-gray-500">
                  관리자 기능은 개발 중입니다.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p className="mb-2">© 2024 FindUs. 분실물을 함께 찾아가는 서비스</p>
            <p className="text-sm">서울시 강남구 · 송파구 시범 운영 중</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
