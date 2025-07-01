
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
    contact: "010-1234-****",
    foundDate: "2024-06-30"
  },
  {
    id: 2,
    title: "검은색 가죽 지갑",
    category: "지갑/가방",
    location: "송파구 잠실역 롯데월드몰",
    date: "2024-06-29",
    status: "습득 보관중",
    description: "검은색 가죽 지갑, 신분증과 카드 다수 포함",
    contact: "010-5678-****",
    foundDate: "2024-06-29"
  },
  {
    id: 3,
    title: "실버 팔찌 (하트 참)",
    category: "액세서리",
    location: "강남구 신사역 가로수길",
    date: "2024-06-28",
    status: "주인 찾음",
    description: "실버 체인 팔찌, 작은 하트 참 달려있음",
    contact: "010-9012-****",
    foundDate: "2024-06-28"
  },
  {
    id: 4,
    title: "에어팟 프로 (화이트)",
    category: "전자기기",
    location: "송파구 석촌호수 둘레길",
    date: "2024-06-27",
    status: "습득 보관중",
    description: "화이트 에어팟 프로, 케이스만 있음",
    contact: "010-3456-****",
    foundDate: "2024-06-27"
  },
  {
    id: 5,
    title: "베이지 크로스백",
    category: "지갑/가방",
    location: "강남구 압구정로데오역",
    date: "2024-06-26",
    status: "경찰서 이관",
    description: "베이지색 작은 크로스백, 골드 체인",
    contact: "강남경찰서",
    foundDate: "2024-06-26"
  },
  {
    id: 6,
    title: "삼성 갤럭시 버즈",
    category: "전자기기",
    location: "서초구 강남역 지하쇼핑센터",
    date: "2024-06-22",
    status: "습득 보관중",
    description: "화이트 갤럭시 버즈, 충전 케이스 포함",
    contact: "010-7890-****",
    foundDate: "2024-06-22"
  },
  {
    id: 7,
    title: "금색 목걸이",
    category: "액세서리",
    location: "중구 명동역 쇼핑거리",
    date: "2024-06-18",
    status: "경찰서 이관",
    description: "금색 체인 목걸이, 작은 펜던트 달려있음",
    contact: "중부경찰서",
    foundDate: "2024-06-18"
  }
];

// 서울 지역 주요 장소 데이터
const locations = [
  // 강남구
  "강남역", "신사역", "압구정로데오역", "선릉역", "역삼역", "논현역", "학동역", "강남구청역",
  
  // 서초구
  "교대역", "서초역", "방배역", "사당역", "남부터미널역", "양재역", "매봉역",
  
  // 송파구
  "잠실역", "석촌호수", "롯데월드타워", "송파구청", "방이역", "오금역", "개롱역",
  
  // 강동구
  "강동역", "길동역", "굽은다리역", "명일역", "고덕역", "상일동역",
  
  // 중구
  "명동역", "을지로입구역", "시청역", "종각역", "동대문역사문화공원역", "충무로역", "동국대입구역",
  
  // 종로구
  "종로3가역", "안국역", "경복궁", "창덕궁", "인사동", "광화문", "종로5가역",
  
  // 용산구
  "용산역", "이촌역", "한강진역", "이태원역", "녹사평역", "남영역",
  
  // 마포구
  "홍대입구역", "신촌역", "합정역", "망원역", "마포구청역", "공덕역", "애오개역",
  
  // 서대문구
  "서대문역", "충정로역", "홍제역", "무악재역", "독립문역",
  
  // 은평구
  "연신내역", "구산역", "응암역", "역촌역", "불광역",
  
  // 성북구
  "성신여대입구역", "한성대입구역", "미아역", "돈암동", "정릉역",
  
  // 강북구
  "미아사거리역", "번동", "수유역", "강북구청", "4.19민주묘지역",
  
  // 도봉구
  "도봉산역", "방학역", "창동역", "도봉구청",
  
  // 노원구
  "노원역", "상계역", "중계역", "하계역", "공릉역", "태릉입구역",
  
  // 동대문구
  "동대문역", "신설동역", "제기동역", "청량리역", "회기역", "외대앞역",
  
  // 중랑구
  "상봉역", "면목역", "사가정역", "용마산역", "중화역",
  
  // 성동구
  "왕십리역", "성수역", "건대입구역", "뚝섬역", "한양대역",
  
  // 광진구
  "구의역", "강변역", "잠실나루역", "서울숲역", "압구정역",
  
  // 동작구
  "사당역", "동작역", "총신대입구역", "상도역", "장승배기역", "신대방삼거리역",
  
  // 관악구
  "신림역", "봉천역", "서울대입구역", "낙성대역", "사당역",
  
  // 금천구
  "금천구청역", "가산디지털단지역", "독산역", "시흥대야역",
  
  // 구로구
  "구로역", "신도림역", "구일역", "개봉역", "오류동역",
  
  // 영등포구
  "영등포구청역", "당산역", "합정역", "여의나루역", "여의도역", "신길역",
  
  // 양천구
  "목동역", "오목교역", "양평역", "신정네거리역", "까치산역",
  
  // 강서구
  "김포공항", "발산역", "마곡나루역", "양천향교역", "가양역"
];

// 서울 구별 데이터
const seoulDistricts = [
  "강남구", "서초구", "송파구", "강동구", "중구", "종로구", "용산구", "마포구",
  "서대문구", "은평구", "성북구", "강북구", "도봉구", "노원구", "동대문구", "중랑구",
  "성동구", "광진구", "동작구", "관악구", "금천구", "구로구", "영등포구", "양천구", "강서구"
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
  
  // 관리자 페이지 상태
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [adminItems, setAdminItems] = useState(mockLostItems);
  
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

  const handleDistrictFilter = () => {
    if (!selectedDistrict) {
      setAdminItems(mockLostItems);
      return;
    }
    
    const filtered = mockLostItems.filter(item => 
      item.location.includes(selectedDistrict)
    );
    setAdminItems(filtered);
  };

  const getOverdueItems = () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    return adminItems.filter(item => {
      const foundDate = new Date(item.foundDate);
      return foundDate < sevenDaysAgo && item.status === "습득 보관중";
    });
  };

  const handleStatusChange = (itemId: number, newStatus: string) => {
    setAdminItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, status: newStatus } : item
      )
    );
    
    toast({
      title: "상태 변경 완료",
      description: `분실물 상태가 "${newStatus}"로 변경되었습니다.`
    });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "습득 보관중": return "bg-blue-100 text-blue-800";
      case "주인 찾음": return "bg-green-100 text-green-800";
      case "경찰서 이관": return "bg-gray-100 text-gray-800";
      case "유실물센터 이관": return "bg-orange-100 text-orange-800";
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
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="search">분실물 찾기</TabsTrigger>
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
                    방문했던 장소를 선택해주세요 (서울 지역)
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

          <TabsContent value="manage" className="space-y-6">
            {/* Admin Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <User className="w-5 h-5 mr-2" />
                  관리자 모니터링
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* District Selection */}
                <div className="flex space-x-4 items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      관할 지역 선택
                    </label>
                    <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                      <SelectTrigger>
                        <SelectValue placeholder="지역을 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">전체 지역</SelectItem>
                        {seoulDistricts.map((district) => (
                          <SelectItem key={district} value={district}>
                            {district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleDistrictFilter} className="bg-gray-900 hover:bg-gray-800">
                    조회
                  </Button>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-gray-900">{adminItems.length}</div>
                      <p className="text-xs text-gray-500">총 분실물</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-blue-600">
                        {adminItems.filter(item => item.status === "습득 보관중").length}
                      </div>
                      <p className="text-xs text-gray-500">보관중</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-orange-600">
                        {getOverdueItems().length}
                      </div>
                      <p className="text-xs text-gray-500">7일 초과</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-green-600">
                        {adminItems.filter(item => item.status === "주인 찾음").length}
                      </div>
                      <p className="text-xs text-gray-500">해결됨</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Lost Items Table */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">분실물 목록</h3>
                    <Badge variant="outline">
                      {selectedDistrict ? selectedDistrict : "전체 지역"}
                    </Badge>
                  </div>
                  
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>물품명</TableHead>
                          <TableHead>습득장소</TableHead>
                          <TableHead>습득일자</TableHead>
                          <TableHead>경과일수</TableHead>
                          <TableHead>상태</TableHead>
                          <TableHead>연락처</TableHead>
                          <TableHead>관리</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {adminItems.map((item) => {
                          const daysSinceFound = Math.floor(
                            (new Date().getTime() - new Date(item.foundDate).getTime()) / (1000 * 3600 * 24)
                          );
                          
                          return (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">{item.title}</TableCell>
                              <TableCell>{item.location}</TableCell>
                              <TableCell>{item.foundDate}</TableCell>
                              <TableCell>
                                <span className={daysSinceFound > 7 ? "text-red-600 font-medium" : ""}>
                                  {daysSinceFound}일
                                </span>
                              </TableCell>
                              <TableCell>
                                <Badge className={getStatusBadgeColor(item.status)}>
                                  {item.status}
                                </Badge>
                              </TableCell>
                              <TableCell>{item.contact}</TableCell>
                              <TableCell>
                                <Select 
                                  value={item.status} 
                                  onValueChange={(value) => handleStatusChange(item.id, value)}
                                >
                                  <SelectTrigger className="w-[160px]">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="습득 보관중">습득 보관중</SelectItem>
                                    <SelectItem value="주인 찾음">주인 찾음</SelectItem>
                                    <SelectItem value="경찰서 이관">경찰서 이관</SelectItem>
                                    <SelectItem value="유실물센터 이관">유실물센터 이관</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Overdue Items Alert */}
                {getOverdueItems().length > 0 && (
                  <Card className="border-orange-200 bg-orange-50">
                    <CardHeader>
                      <CardTitle className="text-orange-800 text-lg">
                        ⚠️ 처리 필요 분실물 ({getOverdueItems().length}개)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-orange-700 text-sm mb-4">
                        다음 분실물들은 습득한지 7일이 넘어 유실물센터로 이관이 필요합니다.
                      </p>
                      <div className="space-y-2">
                        {getOverdueItems().map((item) => (
                          <div key={item.id} className="flex justify-between items-center bg-white p-3 rounded border">
                            <div>
                              <span className="font-medium">{item.title}</span>
                              <span className="text-gray-500 text-sm ml-2">({item.location})</span>
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleStatusChange(item.id, "유실물센터 이관")}
                            >
                              센터 이관
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
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
            <p className="text-sm">서울 전 지역 기반 분실물 통합 검색 서비스</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
