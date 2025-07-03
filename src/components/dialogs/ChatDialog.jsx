import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export const ChatDialog = ({ isOpen, onOpenChange, selectedItem }) => {
  const [chatMessage, setChatMessage] = useState("");
  const { toast } = useToast();

  const handleSubmit = () => {
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

    onOpenChange(false);
    setChatMessage("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[33vw] min-w-[400px]">
        <DialogHeader>
          <DialogTitle>분실물 문의하기</DialogTitle>
        </DialogHeader>
        {selectedItem && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="font-medium text-sm">{selectedItem.title}</h4>
              <p className="text-xs text-gray-500 mt-1">{selectedItem.location}</p>
              {(selectedItem.status === "경찰서 이관" || selectedItem.status === "유실물센터 이관") && (
                <p className="text-xs text-blue-600 mt-1 font-medium">
                  ℹ️ 이 분실물은 {selectedItem.status === "경찰서 이관" ? "경찰서" : "유실물센터"}로 이관되었습니다. 
                  연락처: {selectedItem.contact}
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
              <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
                취소
              </Button>
              <Button onClick={handleSubmit} className="flex-1">
                <MessageCircle className="w-4 h-4 mr-2" />
                전송
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
