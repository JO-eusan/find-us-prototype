
import React, { useState } from 'react';
import { Search, Plus, MapPin, Calendar, User, Bell, X, Camera, Phone } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

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

// 한국 전역 주요 장소 데이터
const locations = [
  // 서울
  "강남역", "홍대입구역", "신촌역", "명동역", "종로3가역", "잠실역", "건대입구역", 
  "신사역", "압구정로데오역", "여의도역", "이태원역", "동대문역사문화공원역",
  "경복궁", "남산타워", "롯데월드타워", "한강공원", "청계천", "동대문 디자인 플라자",
  
  // 부산
  "부산역", "서면역", "해운대역", "광안리해수욕장", "자갈치시장", "태종대", 
  "감천문화마을", "부산항", "센텀시티", "영도대교",
  
  // 대구
  "동대구역", "중앙로역", "반월당역", "서문시장", "앞산공원", "김광석다시그리기길",
  
  // 인천
  "인천국제공항", "송도국제업무단지", "월미도", "차이나타운", "부평역", "작전역",
  
  // 광주
  "광주송정역", "상무지구", "양림동펭귄마을", "국립아시아문화전당",
  
  // 대전
  "대전역", "서대전역", "유성온천", "엑스포과학공원", "한밭수목원",
  
  // 울산
  "울산역", "태화강국가정원", "간절곶", "장생포 고래문화마을",
  
  // 세종
  "세종정부청사", "호수공원", "세종호수공원",
  
  // 경기도
  "수원역", "수원화성", "판교역", "분당서현역", "일산호수공원", "에버랜드", "한국민속촌",
  "광명역", "안양역", "부천역", "김포공항", "의정부역", "파주 DMZ", "화성 제부도",
  
  // 강원도
  "춘천역", "강릉역", "속초해수욕장", "설악산", "남이섬", "정선 아리랑시장",
  "평창 알펜시아", "원주역", "동해역", "삼척해수욕장",
  
  // 충청도
  "공주 공산성", "부여 백제문화단지", "보령 대천해수욕장", "단양 도담삼봉",
  "충주호", "청주 상당산성", "천안 독립기념관", "아산 온양온천",
  
  // 전라도
  "전주한옥마을", "여수 엑스포", "순천만 국가정원", "담양 죽녹원", "보성 녹차밭",
  "목포역", "군산 시간여행", "정읍 내장산", "남원 광한루원",
  
  // 경상도
  "경주 불국사", "안동 하회마을", "포항 호미곶", "거제 외도", "통영 케이블카",
  "진주성", "하동 화개장터", "남해 독일마을", "창원 용지공원", "김해공항",
  
  // 제주도
  "제주공항", "성산일출봉", "한라산", "협재해수욕장", "우도", "천지연폭포",
  "제주 올레길", "서귀포항", "중문관광단지", "애월해안도로"
];

const categories = ["전자기기", "지갑/가방", "액세서리", "의류", "도서/문구", "스포츠용품", "기타"];

const Index = () => {
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredItems, setFilteredItems] = useState(mockLostItems);
  const [activeTab, setActiveTab] = useState("search");
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
  const [isNotificationDialogOpen, setIsNotificationDialogOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const { toast } = useToast();

  // 분실물 등록 폼 상태
  const [registerForm, setRegisterForm] = useState({
    title: "",
    location: "",
    category: "",
    date: "",
    description: "",
    contact: "",
    image: null as File | null
  });

  const handleLocationToggle = (location: string) => {
    setSelectedLocations(prev => 
      prev.includes(location) 
        ? prev.filter(l => l !== location)
        : [...prev, location]
    );
  };

  const handleLocationRemove = (location: string) => {
    setSelectedLocations(prev => prev.filter(l => l !== location));
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

  const handleRegisterSubmit = () => {
    if (!registerForm.title || !registerForm.location || !registerForm.category || !registerForm.date) {
      toast({
        title: "입력 오류",
        description: "필수 항목을 모두 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    // 여기서 실제 등록 로직 구현
    toast({
      title: "등록 완료",
      description: "분실물이 성공적으로 등록되었습니다."
    });

    setIsRegisterDialogOpen(false);
    setRegisterForm({
      title: "",
      location: "",
      category: "",
      date: "",
      description: "",
      contact: "",
      image: null
    });
  };

  const handleNotificationSubmit = () => {
    if (!phoneNumber) {
      toast({
        title: "입력 오류",
        description: "휴대폰 번호를 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "알림 설정 완료",
      description: `${phoneNumber}로 분실물 알림을 발송해드리겠습니다.`
    });

    setIsNotificationDialogOpen(false);
    setPhoneNumber("");
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
              <Dialog open={isNotificationDialogOpen} onOpenChange={setIsNotificationDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Bell className="w-4 h-4 mr-2" />
                    알림설정
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>분실물 알림 설정</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        휴대폰 번호
                      </label>
                      <Input
                        type="tel"
                        placeholder="010-0000-0000"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        선택한 장소에서 새로운 분실물이 등록되면 문자로 알려드립니다.
                      </p>
                    </div>
                    <Button onClick={handleNotificationSubmit} className="w-full">
                      <Phone className="w-4 h-4 mr-2" />
                      알림 설정하기
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isRegisterDialogOpen} onOpenChange={setIsRegisterDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-gray-900 hover:bg-gray-800">
                    <Plus className="w-4 h-4 mr-2" />
                    분실물 등록
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>분실물 등록하기</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          물품명 *
                        </label>
                        <Input
                          placeholder="예: 아이폰 14 Pro"
                          value={registerForm.title}
                          onChange={(e) => setRegisterForm({...registerForm, title: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          카테고리 *
                        </label>
                        <Select value={registerForm.category} onValueChange={(value) => setRegisterForm({...registerForm, category: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="카테고리 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          습득 장소 *
                        </label>
                        <Select value={registerForm.location} onValueChange={(value) => setRegisterForm({...registerForm, location: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="장소 선택" />
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            {locations.map((location) => (
                              <SelectItem key={location} value={location}>
                                {location}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          습득 날짜 *
                        </label>
                        <Input
                          type="date"
                          value={registerForm.date}
                          onChange={(e) => setRegisterForm({...registerForm, date: e.target.value})}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        상세 설명
                      </label>
                      <Textarea
                        placeholder="물품의 특징, 색상, 브랜드 등을 자세히 적어주세요"
                        value={registerForm.description}
                        onChange={(e) => setRegisterForm({...registerForm, description: e.target.value})}
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        연락처
                      </label>
                      <Input
                        type="tel"
                        placeholder="010-0000-0000"
                        value={registerForm.contact}
                        onChange={(e) => setRegisterForm({...registerForm, contact: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        사진 첨부
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500 mb-2">사진을 업로드해주세요</p>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setRegisterForm({...registerForm, image: e.target.files?.[0] || null})}
                          className="hidden"
                          id="image-upload"
                        />
                        <label htmlFor="image-upload" className="cursor-pointer">
                          <Button type="button" variant="outline" size="sm">
                            파일 선택
                          </Button>
                        </label>
                        {registerForm.image && (
                          <p className="text-xs text-gray-600 mt-2">{registerForm.image.name}</p>
                        )}
                      </div>
                    </div>

                    <Button onClick={handleRegisterSubmit} className="w-full">
                      등록하기
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
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
                {/* Selected Locations Display */}
                {selectedLocations.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      선택된 장소
                    </label>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedLocations.map((location) => (
                        <div
                          key={location}
                          className="bg-gray-900 text-white px-3 py-1 rounded-full text-sm flex items-center"
                        >
                          <MapPin className="w-3 h-3 mr-1" />
                          {location}
                          <button
                            onClick={() => handleLocationRemove(location)}
                            className="ml-2 hover:bg-gray-700 rounded-full p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Location Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    방문했던 장소를 선택해주세요
                  </label>
                  <div className="max-h-40 overflow-y-auto border rounded-lg p-3">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {locations.map((location) => (
                        <button
                          key={location}
                          onClick={() => handleLocationToggle(location)}
                          className={`px-3 py-2 rounded-md text-sm transition-colors text-left ${
                            selectedLocations.includes(location)
                              ? 'bg-gray-900 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {location}
                        </button>
                      ))}
                    </div>
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
                  <Button variant="outline" onClick={() => setIsNotificationDialogOpen(true)}>
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
                <div className="text-center py-12">
                  <Plus className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    상단의 "분실물 등록" 버튼을 클릭해주세요
                  </h3>
                  <p className="text-gray-500 mb-4">
                    습득한 물품을 등록하여 주인을 찾아드립니다
                  </p>
                  <Button onClick={() => setIsRegisterDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    분실물 등록하기
                  </Button>
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
            <p className="text-sm">전국 주요 장소 기반 분실물 통합 검색 서비스</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
