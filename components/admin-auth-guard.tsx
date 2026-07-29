import { verifyAdmin } from '@/app/actions/rbac';
import { ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export async function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  let errorMsg = null;

  try {
    await verifyAdmin();
  } catch (error: any) {
    errorMsg = error.message;
  }

  if (errorMsg) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center h-full">
        <Card className="w-full max-w-md border-destructive/50">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <ShieldAlert className="h-12 w-12 text-destructive" />
            </div>
            <CardTitle className="text-2xl text-destructive">Access Denied</CardTitle>
            <CardDescription>
              You do not have permission to view this page.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center text-sm text-muted-foreground">
            {errorMsg === 'Unauthorized' || errorMsg.includes('Forbidden') 
              ? 'This page is restricted to administrators only.' 
              : errorMsg}
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
