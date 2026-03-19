import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function WelcomeMessageSkeleton() {
  return (
    <div className="px-4 lg:px-6">
      <Skeleton className="h-8 w-44" />
      <div className="mt-2">
        <Skeleton className="h-4 w-72" />
      </div>
    </div>
  );
}

export function SectionCardsSkeleton() {
  const cardKeys = ["card-0", "card-1", "card-2", "card-3"] as const;
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {cardKeys.map((cardKey) => (
        <Card key={cardKey} className="@container/card">
          <CardHeader>
            <CardDescription>
              <Skeleton className="h-4 w-36" />
            </CardDescription>
            <CardTitle className="text-2xl">
              <Skeleton className="h-8 w-36" />
            </CardTitle>
            <CardAction>
              <Skeleton className="h-6 w-16 rounded-full" />
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              <Skeleton className="h-4 w-56" />
            </div>
            <div className="text-muted-foreground">
              <Skeleton className="h-4 w-44" />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export function ChartAreaSkeleton() {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-44" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-64" />
        </CardDescription>
        <CardAction>
          <Skeleton className="h-9 w-40 rounded-full" />
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <Skeleton className="h-[250px] w-full rounded-lg" />
      </CardContent>
    </Card>
  );
}

export function MembersTableSkeleton() {
  // Dashboard members table has a fixed column set in this app.
  const headerKeys = ["col-0", "col-1", "col-2", "col-3", "col-4", "col-5", "col-6"] as const;
  const rowKeys = ["row-0", "row-1", "row-2", "row-3", "row-4", "row-5", "row-6", "row-7"] as const;

  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader className="bg-muted sticky top-0 z-10">
          <TableRow>
            {headerKeys.map((colKey) => (
              <TableHead key={colKey}>
                <Skeleton className="h-4 w-28" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rowKeys.map((rowKey) => (
            <TableRow key={rowKey}>
              {headerKeys.map((colKey) => (
                <TableCell key={`${rowKey}-${colKey}`}>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between px-4 py-4">
        <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
          <Skeleton className="h-4 w-64" />
        </div>

        <div className="flex w-full items-center gap-8 lg:w-fit">
          <div className="hidden items-center gap-2 lg:flex">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-9 w-24 rounded-md" />
          </div>

          <div className="flex w-fit items-center justify-center text-sm font-medium">
            <Skeleton className="h-4 w-48" />
          </div>

          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="hidden h-9 w-9 rounded-md lg:flex" />
          </div>
        </div>
      </div>
    </div>
  );
}

