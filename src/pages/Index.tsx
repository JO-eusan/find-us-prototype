
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
import { SearchSection } from "@/components/search/SearchSection";
import { ResultsSection } from "@/components/search/ResultsSection";
import { AdminSection } from "@/components/admin/AdminSection";
import { RegisterDialog } from "@/components/dialogs/RegisterDialog";
import { NotificationDialog } from "@/components/dialogs/NotificationDialog";
import { ChatDialog } from "@/components/dialogs/ChatDialog";
import { ReportDialog } from "@/components/dialogs/ReportDialog";
import { mockLostItems } from "@/data/mockData";

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
  
  // 관리자 페이지 상태
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [adminItems, setAdminItems] = useState(mockLostItems);
  const [statusFilter, setStatusFilter] = useState("all");
  
  const { toast } = useToast();

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

  const sortItems = (items: any[], sortType: string) => {
    switch (sortType) {
      case "status-priority":
        return [...items].sort((a, b) => {
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
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
      case "latest":
        return [...items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      case "oldest":
        return [...items].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      case "nearby":
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

  const handleChatOpen = (item: any) => {
    setSelectedChatItem(item);
    setIsChatDialogOpen(true);
  };

  const handleReportOpen = (item: any) => {
    setSelectedReportItem(item);
    setIsReportDialogOpen(true);
  };

  // 자동 필터링
  useEffect(() => {
    let filtered = mockLostItems;
    
    if (selectedDistrict !== "all") {
      filtered = filtered.filter(item => 
        item.location.includes(selectedDistrict)
      );
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(item => item.status === statusFilter);
    }
    
    setAdminItems(filtered);
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
              <NotificationDialog 
                isOpen={isNotificationDialogOpen}
                onOpenChange={setIsNotificationDialogOpen}
              />
              <RegisterDialog 
                isOpen={isRegisterDialogOpen}
                onOpenChange={setIsRegisterDialogOpen}
              />
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
            <SearchSection
              selectedLocations={selectedLocations}
              locationSearchKeyword={locationSearchKeyword}
              searchKeyword={searchKeyword}
              onLocationToggle={handleLocationToggle}
              onLocationRemove={handleLocationRemove}
              onLocationSearchChange={setLocationSearchKeyword}
              onSearchKeywordChange={setSearchKeyword}
              onSearch={handleSearch}
            />
            
            <ResultsSection
              items={filteredItems}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onChatOpen={handleChatOpen}
              onReportOpen={handleReportOpen}
              onNotificationOpen={() => setIsNotificationDialogOpen(true)}
            />
          </TabsContent>

          <TabsContent value="manage" className="space-y-6">
            <AdminSection
              selectedDistrict={selectedDistrict}
              statusFilter={statusFilter}
              adminItems={adminItems}
              onDistrictChange={setSelectedDistrict}
              onStatusFilterChange={setStatusFilter}
              onStatusChange={(itemId: number, newStatus: string) => {
                setAdminItems(prev => 
                  prev.map(item => 
                    item.id === itemId ? { ...item, status: newStatus } : item
                  )
                );
                toast({
                  title: "상태 변경 완료",
                  description: `분실물 상태가 "${newStatus}"로 변경되었습니다.`
                });
              }}
              onAutoUpdate={() => {
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
              }}
            />
          </TabsContent>
        </Tabs>
      </div>

      <ChatDialog 
        isOpen={isChatDialogOpen}
        onOpenChange={setIsChatDialogOpen}
        selectedItem={selectedChatItem}
      />

      <ReportDialog 
        isOpen={isReportDialogOpen}
        onOpenChange={setIsReportDialogOpen}
        selectedItem={selectedReportItem}
      />

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
