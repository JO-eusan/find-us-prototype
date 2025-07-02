import React, { useState, useEffect } from 'react';
import { Search, Plus, MapPin, Calendar, User, Bell, X, Camera, Phone, MessageCircle, ArrowUpDown, Filter, AlertTriangle } from 'lucide-react';
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

// 서울 지역 주요 장소 데이터 - 사전순으로 정렬
const locations = [
  "강남구청역", "강남역", "강동역", "강북구청", "개롱역", "건대입구역", "경복궁", 
  "고덕역", "공덕역", "공릉역", "광화문", "구로역", "구산역", "구의역", "굽은다리역",
  "금천구청역", "까치산역", "녹사평역", "논현역", "대야역", "도봉구청", "도봉산역",
  "독립문역", "독산역", "돈암동", "동국대입구역", "동대문역", "동작역", "뚝섬역",
  "면목역", "명동역", "명일역", "목동역", "무악재역", "미아사거리역", "미아역",
  "방배역", "방이역", "방학역", "번동", "봉천역", "불광역", "사가정역", "사당역",
  "상계역", "상도역", "상봉역", "상일동역", "서대문역", "서울대입구역", "서울숲역",
  "서초역", "석촌호수", "선릉역", "성산역", "성수역", "성신여대입구역", "세종문화회관",
  "수유역", "신길역", "신도림역", "신림역", "신사역", "신설동역", "신정네거리역",
  "신촌역", "애오개역", "양재역", "양천향교역", "양평역", "여의나루역", "여의도역",
  "연신내역", "영등포구청역", "오금역", "오목교역", "오류동역", "외대앞역", "용마산역",
  "용산역", "을지로입구역", "이촌역", "이태원역", "인사동", "잠실나루역", "잠실역",
  "장승배기역", "정릉역", "제기동역", "종각역", "종로3가역", "종로5가역", "중계역",
  "중화역", "창덕궁", "창동역", "청량리역", "총신대입구역", "충무로역", "충정로역",
  "태릉입구역", "하계역", "학동역", "한강진역", "한성대입구역", "한양대역", "합정역",
  "홍대입구역", "홍제역", "회기역"
].sort(); // 사전순 정렬

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
  const [locationSearchKeyword, setLocationSearchKeyword] = useState("");
  const [filteredItems, setFilteredItems] = useState(mockLostItems);
  const [sortBy, setSortBy] = useState("status-priority");
  const [activeTab, setActiveTab] = useState("search");
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
  const [isNotificationDialogOpen, setIsNotificationDialogOpen] = useState(false);
  const [isChatDialogOpen, setIsChatDialogOpen] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [selectedChatItem, setSelectedChatItem] = useState<any>(null);
  const [selectedReportItem, setSelectedReportItem] = useState<any>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [reportMessage, setReportMessage] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");
  
  // 관리자 페이지 상태
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [adminItems, setAdminItems] = useState(mockLostItems);
  const [statusFilter, setStatusFilter] = useState("all");
  
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

  // 전화번호 포맷 검증 함수
  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    return phoneRegex.test(phone);
  };

  // 미래 날짜 검증 함수
  const validateDate = (date: string) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 시간 제거하고 날짜만 비교
    return selectedDate <= today;
  };

  // 정렬 함수 - 상태 우선순위 추가
  const sortItems = (items: any[], sortType: string) => {
    switch (sortType) {
      case "status-priority":
        return [...items].sort((a, b) => {
          // 보관중 > 경찰서 이관 > 유실물센터 이관 > 주인 찾음 순서
          const statusPriority = {
            "습득 보관중": 1,
            "경찰서 이관": 2,
            "유실물센터 이관": 3,
            "주인 찾음": 4
          };
          const priorityA = statusPriority[a.status as keyof typeof statusPriority] || 5;
          const priorityB = statusPriority[b.status as keyof typeof statusPriority] || 5;
          
          if (priorityA !== priorityB) {
            return priorityA - priorityB;
          }
          // 같은 상태면 최신순
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
      case "latest":
        return [...items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      case "oldest":
        return [...items].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      case "nearby":
        // 선택된 장소와 가까운 순서로 정렬 (간단한 구현)
        return [...items].sort((a, b) => {
          if (selectedLocations.length === 0) return 0;
          const aMatch = selectedLocations.some(loc => a.location.includes(loc)) ? 1 : 0;
          const bMatch = selectedLocations.some(loc => b.location.includes(loc)) ? 1 : 0;
          return bMatch - aMatch;
        });
      default:
        return items;
    }
  };

  // 장소 필터링
  const filteredLocations = locations.filter(location =>
    location.toLowerCase().includes(locationSearchKeyword.toLowerCase())
  );

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
    
    // 정렬 적용
    filtered = sortItems(filtered, sortBy);
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

    // 미래 날짜 검증
    if (!validateDate(registerForm.date)) {
      toast({
        title: "날짜 오류",
        description: "미래 날짜는 선택할 수 없습니다. 오늘 이전 날짜를 선택해주세요.",
        variant: "destructive"
      });
      return;
    }

    // 연락처 검증
    if (registerForm.contact && !validatePhoneNumber(registerForm.contact)) {
      toast({
        title: "전화번호 형식 오류",
        description: "전화번호는 010-0000-0000 형식으로 입력해주세요.",
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

    if (!validatePhoneNumber(phoneNumber)) {
      toast({
        title: "전화번호 형식 오류",
        description: "전화번호는 010-0000-0000 형식으로 입력해주세요.",
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

  const handleChatOpen = (item: any) => {
    setSelectedChatItem(item);
    setIsChatDialogOpen(true);
  };

  const handleReportOpen = (item: any) => {
    setSelectedReportItem(item);
    setIsReportDialogOpen(true);
  };

  const handleChatSubmit = () => {
    if (!chatMessage.trim()) {
      toast({
        title: "입력 오류",
        description: "메시지를 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "메시지 전송 완료",
      description: "소지자에게 메시지가 전송되었습니다."
    });

    setIsChatDialogOpen(false);
    setChatMessage("");
    setSelectedChatItem(null);
  };

  const handleReportSubmit = () => {
    if (!reportMessage.trim()) {
      toast({
        title: "입력 오류",
        description: "신고 내용을 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "신고 접수 완료",
      description: "의의제기가 정상적으로 접수되었습니다. 검토 후 연락드리겠습니다."
    });

    setIsReportDialogOpen(false);
    setReportMessage("");
    setSelectedReportItem(null);
  };

  // 조회 버튼 제거 - handleDistrictFilter 함수는 유지하되 자동 필터링으로 변경
  const handleDistrictFilter = () => {
    let filtered = mockLostItems;
    
    // 지역 필터링
    if (selectedDistrict !== "all") {
      filtered = filtered.filter(item => 
        item.location.includes(selectedDistrict)
      );
    }
    
    // 상태 필터링
    if (statusFilter !== "all") {
      filtered = filtered.filter(item => item.status === statusFilter);
    }
    
    setAdminItems(filtered);
  };

  // 자동 상태 업데이트 함수 - 명확한 설명 추가
  const autoUpdateStatus = () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const updatedItems = adminItems.map(item => {
      const foundDate = new Date(item.foundDate);
      if (foundDate < sevenDaysAgo && item.status === "습득 보관중") {
        return { ...item, status: "유실물센터 이관" };
      }
      return item;
    });
    
    setAdminItems(updatedItems);
    
    const autoUpdatedCount = updatedItems.filter((item, index) => 
      item.status !== adminItems[index].status
    ).length;
    
    if (autoUpdatedCount > 0) {
      toast({
        title: "자동 상태 업데이트 완료",
        description: `${autoUpdatedCount}개의 7일 초과 분실물이 "습득 보관중" → "유실물센터 이관"으로 자동 변경되었습니다.`
      });
    } else {
      toast({
        title: "자동 업데이트 확인 완료",
        description: "7일 초과로 상태 변경이 필요한 분실물이 없습니다."
      });
    }
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

  // 연락처 표시 함수
  const getContactButtonText = (item: any) => {
    if (item.status === "경찰서 이관") {
      return "경찰서 연락";
    } else if (item.status === "유실물센터 이관") {
      return "유실물센터 연락";
    }
    return "연락하기";
  };

  // 상태 필터링 적용 - 자동 필터링
  useEffect(() => {
    handleDistrictFilter();
  }, [statusFilter, selectedDistrict]);

  // 정렬이 변경될 때 검색 결과 다시 정렬
  useEffect(() => {
    if (filteredItems.length > 0) {
      setFilteredItems(sortItems(filteredItems, sortBy));
    }
  }, [sortBy, selectedLocations]);

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
                        onChange={(e) => {
                          setPhoneNumber(e.target.value);
                        }}
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
                          max={new Date().toISOString().split('T')[0]} // 오늘 날짜까지만 허용
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
                      <p className="text-xs text-gray-500 mt-1">
                        010-0000-0000 형식으로 입력해주세요
                      </p>
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
                  
                  {/* Location Search */}
                  <div className="mb-4">
                    <Input
                      placeholder="장소 검색 (예: 강남역, 홍대)"
                      value={locationSearchKeyword}
                      onChange={(e) => setLocationSearchKeyword(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div className="max-h-40 overflow-y-auto border rounded-lg p-3">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {filteredLocations.map((location) => (
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
                <div className="flex items-center space-x-2">
                  <ArrowUpDown className="w-4 h-4 text-gray-500" />
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="status-priority">상태 우선순위</SelectItem>
                      <SelectItem value="latest">최신순</SelectItem>
                      <SelectItem value="oldest">오래된순</SelectItem>
                      <SelectItem value="nearby">주변 분실물</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
                          <Badge className={`${getStatusBadgeColor(item.status)} hover:${getStatusBadgeColor(item.status)} cursor-default`}>
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
                        
                        <div className="pt-3 border-t space-y-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => handleChatOpen(item)}
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            {getContactButtonText(item)}
                          </Button>
                          
                          {/* 해결된 분실물에 대한 신고하기 버튼 */}
                          {(item.status === "주인 찾음" || item.status === "경찰서 이관" || item.status === "유실물센터 이관") && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => handleReportOpen(item)}
                            >
                              <AlertTriangle className="w-4 h-4 mr-2" />
                              신고하기
                            </Button>
                          )}
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
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center text-xl">
                    <User className="w-5 h-5 mr-2" />
                    관리자 모니터링 대시보드
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Button 
                      onClick={autoUpdateStatus}
                      variant="outline"
                      className="bg-gray-50 hover:bg-gray-100 border-gray-300 text-gray-700"
                    >
                      상태 자동 업데이트
                      <span className="text-xs text-gray-500 ml-2">(7일 초과 → 센터 이관)</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* District and Status Selection */}
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
                        <SelectItem value="all">전체 지역</SelectItem>
                        {seoulDistricts.map((district) => (
                          <SelectItem key={district} value={district}>
                            {district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      상태 필터
                    </label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="상태를 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체 상태</SelectItem>
                        <SelectItem value="습득 보관중">습득 보관중</SelectItem>
                        <SelectItem value="주인 찾음">주인 찾음</SelectItem>
                        <SelectItem value="경찰서 이관">경찰서 이관</SelectItem>
                        <SelectItem value="유실물센터 이관">유실물센터 이관</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-blue-900">{adminItems.length}</div>
                      <p className="text-sm text-blue-700">총 분실물</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-green-900">
                        {adminItems.filter(item => item.status === "습득 보관중").length}
                      </div>
                      <p className="text-sm text-green-700">보관중</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-orange-900">
                        {getOverdueItems().length}
                      </div>
                      <p className="text-sm text-orange-700">7일 초과</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-emerald-900">
                        {adminItems.filter(item => item.status === "주인 찾음").length}
                      </div>
                      <p className="text-sm text-emerald-700">해결됨</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Lost Items Table */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">분실물 목록</h3>
                    <Badge variant="outline" className="bg-gray-50">
                      {selectedDistrict === "all" ? "전체 지역" : selectedDistrict}
                    </Badge>
                  </div>
                  
                  <div className="border rounded-lg overflow-hidden bg-white">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="font-semibold">물품명</TableHead>
                          <TableHead className="font-semibold">습득장소</TableHead>
                          <TableHead className="font-semibold">습득일자</TableHead>
                          <TableHead className="font-semibold">경과일수</TableHead>
                          <TableHead className="font-semibold">상태</TableHead>
                          <TableHead className="font-semibold">연락처</TableHead>
                          <TableHead className="font-semibold">관리</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {adminItems.map((item) => {
                          const daysSinceFound = Math.floor(
                            (new Date().getTime() - new Date(item.foundDate).getTime()) / (1000 * 3600 * 24)
                          );
                          
                          return (
                            <TableRow key={item.id} className="hover:bg-gray-50">
                              <TableCell className="font-medium">{item.title}</TableCell>
                              <TableCell>{item.location}</TableCell>
                              <TableCell>{item.foundDate}</TableCell>
                              <TableCell>
                                <span className={daysSinceFound > 7 ? "text-red-600 font-semibold bg-red-50 px-2 py-1 rounded" : "text-gray-600"}>
                                  {daysSinceFound}일
                                </span>
                              </TableCell>
                              <TableCell>
                                <Badge className={`${getStatusBadgeColor(item.status)} cursor-default`}>
                                  {item.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm text-gray-600">{item.contact}</TableCell>
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
                  <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
                    <CardHeader>
                      <CardTitle className="text-orange-800 text-lg flex items-center">
                        ⚠️ 긴급 처리 필요 분실물 ({getOverdueItems().length}개)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-orange-700 text-sm mb-4">
                        다음 분실물들은 습득한지 7일이 넘어 <strong>유실물센터로 즉시 이관</strong>이 필요합니다.
                      </p>
                      <div className="space-y-3">
                        {getOverdueItems().map((item) => (
                          <div key={item.id} className="flex justify-between items-center bg-white p-4 rounded-lg border border-orange-200 shadow-sm">
                            <div>
                              <span className="font-semibold text-gray-900">{item.title}</span>
                              <div className="text-sm text-gray-600 mt-1">
                                <span className="mr-4">📍 {item.location}</span>
                                <span className="text-red-600 font-medium">
                                  {Math.floor((new Date().getTime() - new Date(item.foundDate).getTime()) / (1000 * 3600 * 24))}일 경과
                                </span>
                              </div>
                            </div>
                            <Button 
                              size="sm" 
                              className="bg-orange-600 hover:bg-orange-700 text-white"
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

      {/* Chat Dialog */}
      <Dialog open={isChatDialogOpen} onOpenChange={setIsChatDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>분실물 문의하기</DialogTitle>
          </DialogHeader>
          {selectedChatItem && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-medium text-sm">{selectedChatItem.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{selectedChatItem.location}</p>
                {(selectedChatItem.status === "경찰서 이관" || selectedChatItem.status === "유실물센터 이관") && (
                  <p className="text-xs text-blue-600 mt-1 font-medium">
                    ℹ️ 이 분실물은 {selectedChatItem.status === "경찰서 이관" ? "경찰서" : "유실물센터"}로 이관되었습니다. 
                    연락처: {selectedChatItem.contact}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  메시지
                </label>
                <Textarea
                  placeholder="소지자에게 보낼 메시지를 입력하세요..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  rows={4}
                />
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setIsChatDialogOpen(false)} className="flex-1">
                  취소
                </Button>
                <Button onClick={handleChatSubmit} className="flex-1">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  전송
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Report Dialog - 신고하기 기능 */}
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>분실물 신고하기</DialogTitle>
          </DialogHeader>
          {selectedReportItem && (
            <div className="space-y-4">
              <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                <h4 className="font-medium text-sm text-red-800">{selectedReportItem.title}</h4>
                <p className="text-xs text-red-600 mt-1">{selectedReportItem.location}</p>
                <p className="text-xs text-red-600 mt-1">상태: {selectedReportItem.status}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  신고 사유
                </label>
                <Textarea
                  placeholder="분실물 처리에 대한 의의제기 내용을 상세히 작성해주세요..."
                  value={reportMessage}
                  onChange={(e) => setReportMessage(e.target.value)}
                  rows={4}
                />
                <p className="text-xs text-gray-500 mt-1">
                  신고 내용은 관리자에게 전달되어 검토됩니다.
                </p>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setIsReportDialogOpen(false)} className="flex-1">
                  취소
                </Button>
                <Button onClick={handleReportSubmit} className="flex-1 bg-red-600 hover:bg-red-700">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  신고하기
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
