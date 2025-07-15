import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function RegisterPage() {
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
            <Link href="/login">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">로그인으로 돌아가기</span>
            </Link>
          </Button>
          <div className="grid gap-2">
            <h1 className="text-3xl font-bold">회원가입</h1>
            <p className="text-muted-foreground">
              계정을 만들고 피드백 여정을 시작하세요.
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">이름</Label>
              <Input id="name" placeholder="홍길동" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="id">아이디</Label>
              <Input id="id" placeholder="아이디를 입력하세요" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input id="password" type="password" placeholder="비밀번호를 입력하세요" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">비밀번호 확인</Label>
              <Input id="confirm-password" type="password" placeholder="비밀번호를 다시 입력하세요" required />
            </div>
            <Button type="submit" className="w-full">
              회원가입
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            이미 계정이 있으신가요?
            <Button asChild variant="link" className="text-primary hover:text-primary/90">
              <Link href="/login">로그인</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
