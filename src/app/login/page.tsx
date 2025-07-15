import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
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
              <div className="flex items-center">
                <Label htmlFor="password">비밀번호</Label>
              </div>
              <Input id="password" type="password" placeholder="비밀번호를 입력하세요" required />
            </div>
            <Button type="submit" className="w-full">
              로그인
            </Button>
            <div className="mt-4 text-center text-sm">
                계정이 없으신가요?{' '}
                <Link href="#" className="underline">
                    회원가입
                </Link>
            </div>
          </div>
        </div>
      </div>
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
    </div>
  );
}
