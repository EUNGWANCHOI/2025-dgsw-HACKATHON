import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
       <div className="hidden bg-primary lg:flex items-center justify-center p-8">
        <Link href="/feed">
          <Image
            src="/logo.png"
            alt="Critical Logo"
            width="400"
            height="100"
            className="object-contain"
          />
        </Link>
      </div>
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
           <Button variant="ghost" size="icon" asChild className="justify-self-start">
             <Link href="/feed">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">피드로 돌아가기</span>
             </Link>
           </Button>
          <div className="grid gap-2">
            <h1 className="text-3xl font-bold">로그인</h1>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="id">아이디</Label>
              <Input
                id="id"
                type="text"
                placeholder="아이디를 입력하세요"
                required
              />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="password">비밀번호</Label>
              <Input id="password" type="password" placeholder="비밀번호를 입력하세요" required />
            </div>
            <div className="flex items-center gap-4">
                <Button type="submit" className="flex-1">
                로그인
                </Button>
                <Link href="#" className="text-sm underline">
                    회원가입
                </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
