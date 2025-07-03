
import React from 'react';
import { Search, Bell, MapPin, Calendar, MessageCircle, AlertTriangle, ArrowUpDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const getStatusBadgeColor = (status) => {
  switch (status) {
    case "습득 보관중": return "text-blue-600 bg-white";
    case "주인 찾음": return "text-green-600 bg-white";
    case "경찰서 이관": return "text-orange-500 bg-white";
    case "유실물센터 이관": return "text-gray-600 bg-white";
    default: return "text-gray-600 bg-white";
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
          <Card key={item.id} className="rounded-xl shadow-md" style={{ cursor: 'pointer', transition: 'box-shadow 0.3s', marginBottom: '12px' }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)'}
          >
            <CardContent className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start mb-2">
                  <h3 style={{ fontWeight: '500', color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.title}
                  </h3>
                  <Badge 
                    className={`${getStatusBadgeColor(item.status)} cursor-default border border-gray-200 px-3 py-1 rounded-full`}
                    style={{ pointerEvents: 'none', background: '#fff' }}
                  >
                    {item.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2" style={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {item.description}
                </p>
                <div className="text-xs text-gray-500 flex flex-col gap-2 mb-2">
                  <div className="flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {item.location}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {item.date}
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-200 flex flex-col gap-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full rounded-lg h-9"
                    onClick={() => onChatOpen(item)}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {getContactButtonText(item)}
                  </Button>
                  {/* 신고하기 버튼 */}
                  {(item.status === "주인 찾음" || item.status === "경찰서 이관" || item.status === "유실물센터 이관") && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full rounded-lg h-9 bg-white text-red-600 border-red-200 hover:bg-red-50 font-semibold"
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
