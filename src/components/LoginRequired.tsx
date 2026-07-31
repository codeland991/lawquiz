import AuthButton from "@/components/AuthButton";

export default function LoginRequired({
  message = "로그인이 필요한 기능입니다.",
}: {
  message?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <p className="text-sm text-foreground/60">{message}</p>
      <AuthButton />
    </div>
  );
}
