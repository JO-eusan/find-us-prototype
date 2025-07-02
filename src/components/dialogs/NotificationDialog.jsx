
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Phone } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export const NotificationDialog = ({ isOpen, onOpenChange }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const { toast } = useToast();

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = () => {
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

    onOpenChange(false);
    setPhoneNumber("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
          <Button onClick={handleSubmit} className="w-full">
            <Phone className="w-4 h-4 mr-2" />
            알림 설정하기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
