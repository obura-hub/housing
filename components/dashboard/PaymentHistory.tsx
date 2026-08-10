import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircleIcon, ClockIcon } from "lucide-react";

interface Payment {
  id: number;
  amount: number;
  payment_date: string;
  reference: string;
  status: string;
  method: string;
}

export function PaymentHistory({ payments }: { payments: Payment[] }) {
  if (payments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground border rounded-lg">
        <p>No payments recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Reference</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell className="whitespace-nowrap">
                {new Date(payment.payment_date).toLocaleDateString()}
              </TableCell>
              <TableCell className="font-medium">
                Ksh {payment.amount.toLocaleString()}
              </TableCell>
              <TableCell className="capitalize">{payment.method}</TableCell>
              <TableCell>{payment.reference || "—"}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    payment.status === "completed" ? "default" : "secondary"
                  }
                  className={
                    payment.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-amber-100 text-amber-800"
                  }
                >
                  {payment.status === "completed" ? (
                    <CheckCircleIcon className="h-3 w-3 mr-1" />
                  ) : (
                    <ClockIcon className="h-3 w-3 mr-1" />
                  )}
                  {payment.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
