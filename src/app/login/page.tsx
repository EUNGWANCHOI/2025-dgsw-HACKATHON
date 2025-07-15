
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-muted/30 p-4">
      <Card className="mx-auto w-full max-w-sm">
        <CardHeader className="text-center">
            <Image 
                src="/logo.png" 
                width={80} 
                height={80} 
                alt="크리티컬 로고" 
                className="mx-auto mb-4 rounded-lg"
                data-ai-hint="logo design"
            />
          <CardTitle className="text-2xl font-bold tracking-tight">로그인</CardTitle>
          <CardDescription>계정에 로그인하여 콘텐츠 피드백을 받아보세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">비밀번호</Label>
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline"
                >
                  비밀번호를 잊으셨나요?
                </Link>
              </div>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              로그인
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            계정이 없으신가요?{' '}
            <Link href="#" className="underline">
              가입하기
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
