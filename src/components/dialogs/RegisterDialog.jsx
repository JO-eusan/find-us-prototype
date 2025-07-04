
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Camera } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { locations, categories } from "@/data/mockData";

export const RegisterDialog = ({ isOpen, onOpenChange }) => {
  const [registerForm, setRegisterForm] = useState({
    title: "",
    location: "",
    category: "",
    date: "",
    description: "",
    contact: "",
    image: null
  });
  
  const { toast } = useToast();

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    return phoneRegex.test(phone);
  };

  const validateDate = (date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate <= today;
  };

  const handleSubmit = () => {
    if (!registerForm.title || !registerForm.location || !registerForm.category || !registerForm.date) {
      toast({
        title: "입력 오류",
        description: "필수 항목을 모두 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    if (!validateDate(registerForm.date)) {
      toast({
        title: "날짜 오류",
        description: "미래 날짜는 선택할 수 없습니다. 오늘 이전 날짜를 선택해주세요.",
        variant: "destructive"
      });
      return;
    }

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

    onOpenChange(false);
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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" variant="default" className="bg-black text-white hover:bg-gray-800 h-9" style={{backgroundColor: '#000', color: '#fff'}}>
          <Plus className="w-4 h-4 mr-2" />
          분실물 등록
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[25vw] min-w-[350px] bg-white rounded-2xl shadow-2xl max-h-[80vh] overflow-y-auto my-20">
        <DialogHeader className="px-4 pt-4 pb-2">
          <DialogTitle className="text-lg font-semibold">분실물 등록하기</DialogTitle>
        </DialogHeader>
        <div className="px-4 pb-4 space-y-3">
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                물품명 *
              </label>
              <Input
                placeholder="예: 아이폰 14 Pro"
                value={registerForm.title}
                onChange={(e) => setRegisterForm({...registerForm, title: e.target.value})}
                className="h-9"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                카테고리 *
              </label>
              <Select value={registerForm.category} onValueChange={(value) => setRegisterForm({...registerForm, category: value})}>
                <SelectTrigger className="h-9">
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
          
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                습득 장소 *
              </label>
              <Select value={registerForm.location} onValueChange={(value) => setRegisterForm({...registerForm, location: value})}>
                <SelectTrigger className="h-9">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                습득 날짜 *
              </label>
              <Input
                type="date"
                value={registerForm.date}
                onChange={(e) => setRegisterForm({...registerForm, date: e.target.value})}
                max={new Date().toISOString().split('T')[0]}
                className="h-9"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              상세 설명
            </label>
            <Textarea
              placeholder="물품의 특징, 색상, 브랜드 등을 자세히 적어주세요"
              value={registerForm.description}
              onChange={(e) => setRegisterForm({...registerForm, description: e.target.value})}
              rows={2}
              className="resize-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              연락처
            </label>
            <Input
              type="tel"
              placeholder="010-0000-0000"
              value={registerForm.contact}
              onChange={(e) => setRegisterForm({...registerForm, contact: e.target.value})}
              className="h-9"
            />
            <p className="text-xs text-gray-500 mt-1">
              010-0000-0000 형식으로 입력해주세요
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              사진 첨부
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center">
              <Camera className="w-5 h-5 text-gray-400 mx-auto mb-1" />
              <p className="text-xs text-gray-500 mb-2">사진을 업로드해주세요</p>
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
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-end pt-3">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-lg px-4 py-2 h-9">
              취소
            </Button>
            <Button 
              onClick={handleSubmit}
              className="bg-black text-white hover:bg-gray-800 rounded-lg px-4 py-2 h-9 font-semibold" 
              style={{backgroundColor: '#000', color: '#fff'}}
            >
              <Plus className="w-4 h-4 mr-2" />
              분실물 등록
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
