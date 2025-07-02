import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export const ReportDialog = ({ isOpen, onOpenChange, selectedItem }) => {
  const [reportMessage, setReportMessage] = useState("");
  const { toast } = useToast();

  const handleSubmit = () => {
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

    onOpenChange(false);
    setReportMessage("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>분실물 신고하기</DialogTitle>
        </DialogHeader>
        {selectedItem && (
          <div className="space-y-4">
            <div className="bg-red-50 p-3 rounded-lg border border-red-200">
              <h4 className="font-medium text-sm text-red-800">{selectedItem.title}</h4>
              <p className="text-xs text-red-600 mt-1">{selectedItem.location}</p>
              <p className="text-xs text-red-600 mt-1">상태: {selectedItem.status}</p>
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
              <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1 rounded-lg">
                취소
              </Button>
              <Button onClick={handleSubmit} className="flex-1 bg-white text-red-600 border border-red-200 hover:bg-red-50 rounded-lg font-semibold" style={{boxShadow: 'none'}}>
                <AlertTriangle className="w-4 h-4 mr-2" />
                신고하기
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
