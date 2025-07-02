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
    case "습득 보관중": return "bg-blue-100 text-blue-800";
    case "주인 찾음": return "bg-green-100 text-green-800";
    case "경찰서 이관": return "bg-gray-100 text-gray-800";
    case "유실물센터 이관": return "bg-orange-100 text-orange-800";
    default: return "bg-gray-100 text-gray-800";
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
              style={{ 
                backgroundColor: '#f9fafb', 
                borderColor: '#d1d5db', 
                color: '#374151'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#f9fafb'}
            >
              상태 자동 업데이트
              <span style={{ fontSize: '12px', color: '#6b7280', marginLeft: '8px' }}>
                (7일 초과 → 센터 이관)
              </span>
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
            <Select value={selectedDistrict} onValueChange={onDistrictChange}>
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
            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <Card style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', borderColor: '#93c5fd' }}>
            <CardContent className="p-4">
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e3a8a' }}>{adminItems.length}</div>
              <p style={{ fontSize: '14px', color: '#1e40af' }}>총 분실물</p>
            </CardContent>
          </Card>
          <Card style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', borderColor: '#86efac' }}>
            <CardContent className="p-4">
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#14532d' }}>
                {adminItems.filter(item => item.status === "습득 보관중").length}
              </div>
              <p style={{ fontSize: '14px', color: '#15803d' }}>보관중</p>
            </CardContent>
          </Card>
          <Card style={{ background: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)', borderColor: '#fb923c' }}>
            <CardContent className="p-4">
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#9a3412' }}>
                {overdueItems.length}
              </div>
              <p style={{ fontSize: '14px', color: '#c2410c' }}>7일 초과</p>
            </CardContent>
          </Card>
          <Card style={{ background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', borderColor: '#6ee7b7' }}>
            <CardContent className="p-4">
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#064e3b' }}>
                {adminItems.filter(item => item.status === "주인 찾음").length}
              </div>
              <p style={{ fontSize: '14px', color: '#065f46' }}>해결됨</p>
            </CardContent>
          </Card>
        </div>

        {/* Lost Items Table */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">분실물 목록</h3>
            <Badge variant="outline" style={{ backgroundColor: '#f9fafb' }}>
              {selectedDistrict === "all" ? "전체 지역" : selectedDistrict}
            </Badge>
          </div>
          
          <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'white' }}>
            <Table>
              <TableHeader>
                <TableRow style={{ backgroundColor: '#f9fafb' }}>
                  <TableHead style={{ fontWeight: '600' }}>물품명</TableHead>
                  <TableHead style={{ fontWeight: '600' }}>습득장소</TableHead>
                  <TableHead style={{ fontWeight: '600' }}>습득일자</TableHead>
                  <TableHead style={{ fontWeight: '600' }}>경과일수</TableHead>
                  <TableHead style={{ fontWeight: '600' }}>상태</TableHead>
                  <TableHead style={{ fontWeight: '600' }}>연락처</TableHead>
                  <TableHead style={{ fontWeight: '600' }}>관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adminItems.map((item) => {
                  const daysSinceFound = Math.floor(
                    (new Date().getTime() - new Date(item.foundDate).getTime()) / (1000 * 3600 * 24)
                  );
                  
                  return (
                    <TableRow key={item.id}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <TableCell style={{ fontWeight: '500' }}>{item.title}</TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell>{item.foundDate}</TableCell>
                      <TableCell>
                        <span style={{
                          color: daysSinceFound > 7 ? '#dc2626' : '#4b5563',
                          fontWeight: daysSinceFound > 7 ? '600' : 'normal',
                          backgroundColor: daysSinceFound > 7 ? '#fef2f2' : 'transparent',
                          padding: daysSinceFound > 7 ? '4px 8px' : '0',
                          borderRadius: daysSinceFound > 7 ? '4px' : '0'
                        }}>
                          {daysSinceFound}일
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={`${getStatusBadgeColor(item.status)}`}
                          style={{ cursor: 'default', pointerEvents: 'none' }}
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell style={{ fontSize: '14px', color: '#4b5563' }}>{item.contact}</TableCell>
                      <TableCell>
                        <Select 
                          value={item.status} 
                          onValueChange={(value) => onStatusChange(item.id, value)}
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
        {overdueItems.length > 0 && (
          <Card style={{ borderColor: '#fed7aa', background: 'linear-gradient(90deg, #fef3c7 0%, #fef2f2 100%)' }}>
            <CardHeader>
              <CardTitle style={{ color: '#9a3412', fontSize: '18px', display: 'flex', alignItems: 'center' }}>
                ⚠️ 긴급 처리 필요 분실물 ({overdueItems.length}개)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p style={{ color: '#c2410c', fontSize: '14px', marginBottom: '16px' }}>
                다음 분실물들은 습득한지 7일이 넘어 <strong>유실물센터로 즉시 이관</strong>이 필요합니다.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {overdueItems.map((item) => (
                  <div key={item.id} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    backgroundColor: 'white', 
                    padding: '16px', 
                    borderRadius: '8px', 
                    border: '1px solid #fed7aa',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                  }}>
                    <div>
                      <span style={{ fontWeight: '600', color: '#111827' }}>{item.title}</span>
                      <div style={{ fontSize: '14px', color: '#4b5563', marginTop: '4px' }}>
                        <span style={{ marginRight: '16px' }}>📍 {item.location}</span>
                        <span style={{ color: '#dc2626', fontWeight: '500' }}>
                          {Math.floor((new Date().getTime() - new Date(item.foundDate).getTime()) / (1000 * 3600 * 24))}일 경과
                        </span>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      style={{ backgroundColor: '#ea580c', color: 'white' }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#c2410c'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#ea580c'}
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
