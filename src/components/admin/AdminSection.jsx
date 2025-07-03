
import React from 'react';
import { User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { seoulDistricts } from "@/data/mockData";

const getStatusBadgeColor = (status) => {
  switch (status) {
    case "습득 보관중": return "text-blue-600 bg-white border border-gray-200 px-3 py-1 rounded-full";
    case "주인 찾음": return "text-green-600 bg-white border border-gray-200 px-3 py-1 rounded-full";
    case "경찰서 이관": return "text-orange-500 bg-white border border-gray-200 px-3 py-1 rounded-full";
    case "유실물센터 이관": return "text-gray-600 bg-white border border-gray-200 px-3 py-1 rounded-full";
    default: return "text-gray-600 bg-white border border-gray-200 px-3 py-1 rounded-full";
  }
};

const getOverdueItems = (items) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  return items.filter(item => {
    const foundDate = new Date(item.foundDate);
    return foundDate < sevenDaysAgo && item.status === "습득 보관중";
  });
};

export const AdminSection = ({
  selectedDistrict,
  statusFilter,
  adminItems,
  onDistrictChange,
  onStatusFilterChange,
  onStatusChange,
  onAutoUpdate
}) => {
  const overdueItems = getOverdueItems(adminItems);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center text-xl">
            <User className="w-5 h-5 mr-2" />
            관리자 대시보드
          </CardTitle>
          <div className="flex space-x-2">
            <Button 
              onClick={onAutoUpdate}
              variant="outline"
              className="bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200"
            >
              상태 자동 업데이트
              <span className="text-xs text-gray-500 ml-2">
                (7일 초과 → 센터 이관)
              </span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* District and Status Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              관할 지역 선택
            </label>
            <Select value={selectedDistrict} onValueChange={onDistrictChange}>
              <SelectTrigger className="h-11">
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              상태 필터
            </label>
            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
              <SelectTrigger className="h-11">
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
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-gray-800">{adminItems.length}</div>
              <p className="text-sm text-gray-600">총 분실물</p>
            </CardContent>
          </Card>
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-blue-800">
                {adminItems.filter(item => item.status === "습득 보관중").length}
              </div>
              <p className="text-sm text-blue-600">보관중</p>
            </CardContent>
          </Card>
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-orange-800">
                {overdueItems.length}
              </div>
              <p className="text-sm text-orange-600">7일 초과</p>
            </CardContent>
          </Card>
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-800">
                {adminItems.filter(item => item.status === "주인 찾음").length}
              </div>
              <p className="text-sm text-green-600">해결됨</p>
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
          
          <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-900">물품명</TableHead>
                    <TableHead className="font-semibold text-gray-900">습득장소</TableHead>
                    <TableHead className="font-semibold text-gray-900">습득일자</TableHead>
                    <TableHead className="font-semibold text-gray-900">경과일수</TableHead>
                    <TableHead className="font-semibold text-gray-900">상태</TableHead>
                    <TableHead className="font-semibold text-gray-900">연락처</TableHead>
                    <TableHead className="font-semibold text-gray-900">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminItems.map((item) => {
                    const daysSinceFound = Math.floor(
                      (new Date().getTime() - new Date(item.foundDate).getTime()) / (1000 * 3600 * 24)
                    );
                    
                    return (
                      <TableRow key={item.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <TableCell className="font-medium">{item.title}</TableCell>
                        <TableCell className="text-gray-600">{item.location}</TableCell>
                        <TableCell className="text-gray-600">{item.foundDate}</TableCell>
                        <TableCell>
                          <span className={`font-medium ${
                            daysSinceFound > 7 ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {daysSinceFound}일
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadgeColor(item.status)}>
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">{item.contact}</TableCell>
                        <TableCell>
                          <Select 
                            value={item.status} 
                            onValueChange={(value) => onStatusChange(item.id, value)}
                          >
                            <SelectTrigger className="w-[160px] h-9">
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
        </div>

        {/* Overdue Items Alert */}
        {overdueItems.length > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800 text-lg flex items-center">
                ⚠️ 긴급 처리 필요 분실물 ({overdueItems.length}개)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700 text-sm mb-4">
                다음 분실물들은 습득한지 7일이 넘어 <strong>유실물센터로 즉시 이관</strong>이 필요합니다.
              </p>
              <div className="space-y-3">
                {overdueItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center bg-white p-4 rounded-lg border border-red-200 shadow-sm">
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
                      className="bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => onStatusChange(item.id, "유실물센터 이관")}
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
  );
};
