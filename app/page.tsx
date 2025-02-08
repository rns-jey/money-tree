"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDownIcon } from "lucide-react";

interface BankResult {
  bank: string;
  type: string;
  interest: number;
  gross: (principal: number) => number;
  tax: (principal: number) => number;
  earnings: (principal: number) => number;
}

export default function BankCalculator() {
  const [principal, setPrincipal] = useState<number>(100000);
  const [sortBy, setSortBy] = useState<"interest" | "earnings" | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const calculateResults = (): BankResult[] => {
    const bankA = {
      bank: "SeaBank",
      type: "Savings Account",
      interest: 4,
      gross: function (principal: number) {
        return (principal * 0.04) / 365;
      },
      tax: function (principal: number) {
        return this.gross(principal) * 0.2;
      },
      earnings: function (principal: number) {
        return (this.gross(principal) - this.tax(principal)) * 365;
      },
    };

    const bankB = {
      bank: "Own Bank",
      type: "Time Deposit",
      interest: 7.5,
      gross: function (principal: number) {
        return principal * (0.075 / 360) * 360;
      },
      tax: function (principal: number) {
        return this.gross(principal) * 0.2;
      },
      earnings: function (principal: number) {
        return this.gross(principal) - this.tax(principal);
      },
    };

    const bankC = {
      bank: "TonikBank",
      type: "Time Deposit",
      interest: 4.55,
      gross: function (principal: number) {
        return (principal * 0.0455 * 365) / 365;
      },
      tax: function (principal: number) {
        return this.gross(principal) * 0.2;
      },
      earnings: function (principal: number) {
        return this.gross(principal) - this.tax(principal);
      },
    };

    const results = [bankA, bankB, bankC];

    if (sortBy) {
      results.sort((a, b) => {
        const compareValue = sortOrder === "asc" ? 1 : -1;
        return a[sortBy] > b[sortBy] ? compareValue : -compareValue;
      });
    }

    return results;
  };

  const handleSort = (column: "interest" | "earnings") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const results = calculateResults();

  return (
    <Card className="w-full max-w-3xl mx-auto my-5">
      <CardHeader>
        <CardTitle>Bank Interest Calculator</CardTitle>
        <CardDescription>Compare interest rates and earnings between different banks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="grid gap-2">
              <Label htmlFor="principal">Principal Amount</Label>
              <Input
                id="principal"
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                min={0}
              />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bank</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("interest")}>
                  Interest Rate (%)
                  <ArrowUpDownIcon className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("earnings")}>
                  1 Year Earnings
                  <ArrowUpDownIcon className="ml-2 h-4 w-4 inline" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result) => (
                <TableRow key={result.bank}>
                  <TableCell className="font-medium">{result.bank}</TableCell>
                  <TableCell>{result.type}</TableCell>
                  <TableCell>{result.interest.toFixed(2)}%</TableCell>
                  <TableCell>{result.earnings(principal).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
