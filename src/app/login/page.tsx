
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: '로그인 성공', description: '피드 페이지로 이동합니다.' });
      router.push('/feed');
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: '로그인 실패',
        description: '이메일 또는 비밀번호를 확인해주세요.',
      });
    } finally {
      setIsLoading(false);
    }
  };

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
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              로그인
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            계정이 없으신가요?
            <Button asChild variant="link" className="text-primary hover:text-primary/90">
              <Link href="/register">회원가입</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
