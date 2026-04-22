// app/dashboard/payments/PaymentsClient.tsx (Enhanced)
"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  CalendarIcon,
  Download,
  X,
  Receipt,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Payment {
  id: number;
  amount: number;
  createdAt: string;
  reference: string | null;
  status: string;
  method: string;
}

interface PaymentsClientProps {
  payments: Payment[];
}

const ITEMS_PER_PAGE = 10;

export function PaymentsClient({ payments }: PaymentsClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [methodFilter, setMethodFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Get unique methods for filter
  const uniqueMethods = useMemo(() => {
    const methods = new Set(payments.map((p) => p.method));
    return Array.from(methods).sort();
  }, [payments]);

  // Filter payments
  const filteredPayments = useMemo(() => {
    let filtered = [...payments];

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.amount.toString().includes(searchTerm),
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    if (methodFilter !== "all") {
      filtered = filtered.filter((p) => p.method === methodFilter);
    }

    return filtered;
  }, [payments, searchTerm, statusFilter, methodFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredPayments.length / ITEMS_PER_PAGE);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const hasActiveFilters =
    searchTerm !== "" || statusFilter !== "all" || methodFilter !== "all";

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setMethodFilter("all");
    setCurrentPage(1);
  };

  const exportCSV = () => {
    const headers = ["Date", "Amount (Ksh)", "Method", "Reference", "Status"];
    const rows = filteredPayments.map((p) => [
      format(new Date(p.createdAt), "yyyy-MM-dd HH:mm:ss"),
      p.amount.toString(),
      p.method,
      p.reference || "",
      p.status,
    ]);
    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payments_${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const statusColors: Record<string, string> = {
    completed:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200",
    pending:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200",
    failed:
      "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200",
  };

  // Mobile Card View
  const MobileCardView = () => (
    <div className="space-y-3 md:hidden">
      {paginatedPayments.map((payment) => (
        <div
          key={payment.id}
          className="border rounded-lg p-4 space-y-2 bg-card"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="font-bold text-lg">
                Ksh {payment.amount.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(payment.createdAt), "dd MMM yyyy, HH:mm")}
              </p>
            </div>
            <Badge className={statusColors[payment.status] || ""}>
              {payment.status}
            </Badge>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Method:</span>
            <span className="capitalize font-medium">{payment.method}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Reference:</span>
            <span className="font-mono text-xs">
              {payment.reference || "—"}
            </span>
          </div>
          <div className="pt-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full gap-1 text-primary"
            >
              <Receipt className="h-3 w-3" /> View Receipt
            </Button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Filters Row */}
      <div className="flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[180px]">
          <label className="text-sm font-medium mb-1 block">Search</label>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Reference, amount, or method..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-9"
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Status</label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px] h-9">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Method</label>
          <Select value={methodFilter} onValueChange={setMethodFilter}>
            <SelectTrigger className="w-[130px] h-9">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {uniqueMethods.map((method) => (
                <SelectItem key={method} value={method} className="capitalize">
                  {method}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" onClick={exportCSV} className="gap-2 h-9">
          <Download className="h-4 w-4" /> Export
        </Button>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="gap-1 h-9 text-destructive"
          >
            <X className="h-4 w-4" /> Clear
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <Badge variant="secondary" className="gap-1 pl-2 pr-1">
              Search: {searchTerm}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setSearchTerm("")}
              />
            </Badge>
          )}
          {statusFilter !== "all" && (
            <Badge variant="secondary" className="gap-1 pl-2 pr-1 capitalize">
              Status: {statusFilter}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setStatusFilter("all")}
              />
            </Badge>
          )}
          {methodFilter !== "all" && (
            <Badge variant="secondary" className="gap-1 pl-2 pr-1 capitalize">
              Method: {methodFilter}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setMethodFilter("all")}
              />
            </Badge>
          )}
        </div>
      )}

      {/* Results Count */}
      <p className="text-sm text-muted-foreground">
        Showing {paginatedPayments.length} of {filteredPayments.length}{" "}
        transactions
      </p>

      {/* Desktop Table */}
      {filteredPayments.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <Receipt className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
          <p className="text-muted-foreground">
            No payments found matching your filters.
          </p>
          {hasActiveFilters && (
            <Button variant="link" onClick={clearFilters} className="mt-2">
              Clear all filters
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="hidden md:block rounded-md border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount (Ksh)</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPayments.map((payment, idx) => (
                  <TableRow
                    key={payment.id}
                    className="transition-colors hover:bg-muted/30 group animate-in fade-in duration-300"
                    style={{ animationDelay: `${idx * 30}ms` }}
                  >
                    <TableCell className="whitespace-nowrap">
                      {format(
                        new Date(payment.createdAt),
                        "dd MMM yyyy, HH:mm",
                      )}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {payment.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="capitalize">
                      {payment.method}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {payment.reference || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[payment.status] || ""}>
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Receipt className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <MobileCardView />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
