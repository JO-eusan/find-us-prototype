import React from 'react';
import { Search, Bell, MapPin, Calendar, MessageCircle, AlertTriangle, ArrowUpDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const getStatusBadgeColor = (status) => {
  switch (status) {
    case "습득 보관중": return "text-blue-600";
    case "주인 찾음": return "text-green-600";
    case "경찰서 이관": return "text-orange-500";
    case "유실물센터 이관": return "text-gray-600";
    default: return "text-gray-600";
  }
};

const getContactButtonText = (item) => {
  if (item.status === "경찰서 이관") {
    return "경찰서 연락";
  } else if (item.status === "유실물센터 이관") {
    return "유실물센터 연락";
  }
  return "연락하기";
};

export const ResultsSection = ({
  items,
  sortBy,
  onSortChange,
  onChatOpen,
  onReportOpen,
  onNotificationOpen
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          검색 결과 ({items.length}개)
        </h2>
        <div className="flex items-center space-x-2">
          <ArrowUpDown className="w-4 h-4 text-gray-500" />
          <Select value={sortBy} onValueChange={onSortChange}>
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

      <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        {items.map((item) => (
          <Card key={item.id} style={{ cursor: 'pointer', transition: 'box-shadow 0.3s' }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)'}
          >
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h3 style={{ fontWeight: '500', color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.title}
                  </h3>
                  <Badge 
                    className={`${getStatusBadgeColor(item.status)} cursor-default`}
                    style={{ pointerEvents: 'none' }}
                  >
                    {item.status}
                  </Badge>
                </div>
                
                <p style={{ fontSize: '14px', color: '#4b5563', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {item.description}
                </p>
                
                <div style={{ fontSize: '12px', color: '#6b7280', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <MapPin className="w-3 h-3 mr-1" />
                    {item.location}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Calendar className="w-3 h-3 mr-1" />
                    {item.date}
                  </div>
                </div>
                
                <div style={{ paddingTop: '12px', borderTop: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => onChatOpen(item)}
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
                      onClick={() => onReportOpen(item)}
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

      {items.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            검색 결과가 없습니다
          </h3>
          <p className="text-gray-500 mb-4">
            다른 키워드나 장소로 다시 검색해보세요
          </p>
          <Button variant="outline" onClick={onNotificationOpen}>
            <Bell className="w-4 h-4 mr-2" />
            알림 설정하기
          </Button>
        </div>
      )}
    </div>
  );
};
