
import React from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { locations } from "@/data/mockData";

export const SearchSection = ({
  selectedLocations,
  locationSearchKeyword,
  searchKeyword,
  onLocationToggle,
  onLocationRemove,
  onLocationSearchChange,
  onSearchKeywordChange,
  onSearch
}) => {
  // 장소 필터링
  const filteredLocations = locations.filter(location =>
    location.toLowerCase().includes(locationSearchKeyword.toLowerCase())
  );

  return (
    <Card className="animate-fade-in rounded-xl shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-xl">
          <Search className="w-5 h-5 mr-2" />
          방문 장소 기반 분실물 검색
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {/* Selected Locations Display */}
        {selectedLocations.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              선택된 장소
            </label>
            <div className="flex flex-wrap gap-2">
              {selectedLocations.map((location) => (
                <div
                  key={location}
                  className="bg-white text-gray-900 px-4 py-2 rounded-full text-sm flex items-center border border-gray-300 shadow-sm"
                >
                  <MapPin className="w-3 h-3 mr-1" />
                  {location}
                  <button
                    onClick={() => onLocationRemove(location)}
                    className="ml-2 hover:bg-gray-100 rounded-full p-0.5"
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
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
              onChange={(e) => onLocationSearchChange(e.target.value)}
              className="w-full rounded-lg px-4 py-3"
            />
          </div>
          <div style={{ maxHeight: '180px', overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
              {filteredLocations.map((location) => (
                <button
                  key={location}
                  onClick={() => onLocationToggle(location)}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    textAlign: 'left',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    backgroundColor: selectedLocations.includes(location) ? '#111827' : '#f3f4f6',
                    color: selectedLocations.includes(location) ? 'white' : '#374151'
                  }}
                  onMouseEnter={(e) => {
                    if (!selectedLocations.includes(location)) {
                      e.target.style.backgroundColor = '#e5e7eb';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!selectedLocations.includes(location)) {
                      e.target.style.backgroundColor = '#f3f4f6';
                    }
                  }}
                >
                  {location}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search Input */}
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              분실물 키워드
            </label>
            <Input
              placeholder="분실물 키워드를 입력하세요 (예: 아이폰, 지갑, 팔찌)"
              value={searchKeyword}
              onChange={(e) => onSearchKeywordChange(e.target.value)}
              className="w-full rounded-lg px-4 py-3"
            />
          </div>
          <Button 
            onClick={onSearch} 
            className="w-full sm:w-auto bg-white hover:bg-gray-50 text-black border border-gray-300 rounded-lg px-8 py-3 font-semibold shadow-md transition-colors"
          >
            <Search className="w-4 h-4 mr-2" />
            검색
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
