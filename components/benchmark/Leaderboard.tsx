import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getLeaderboard } from "@/data/results";
import { Trophy, Medal } from "lucide-react";

export async function Leaderboard({ benchmarkId }: { benchmarkId: number }) {
	const results = await getLeaderboard(benchmarkId);

	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[100px]">Rank</TableHead>
						<TableHead>User</TableHead>
						<TableHead>Score</TableHead>
						<TableHead>Date</TableHead>
						<TableHead>Status</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{results.map((result, index) => {
						const rank = index + 1;
						let RankIcon = null;
						if (rank === 1) RankIcon = <Trophy className="h-4 w-4 text-yellow-500" />;
						else if (rank === 2) RankIcon = <Medal className="h-4 w-4 text-gray-400" />;
						else if (rank === 3) RankIcon = <Medal className="h-4 w-4 text-amber-600" />;

						return (
							<TableRow key={result.id}>
								<TableCell className="font-medium">
									<div className="flex items-center gap-2">
										{RankIcon}
										<span className={RankIcon ? "ml-1" : "ml-6"}>{rank}</span>
									</div>
								</TableCell>
								<TableCell>
									<div className="flex items-center gap-2">
										<Avatar className="h-8 w-8">
											<AvatarFallback
												style={{
													backgroundColor: result.submittedBy.colors.light,
													color: "white",
												}}>
												{result.submittedBy.nickname.substring(0, 2).toUpperCase()}
											</AvatarFallback>
										</Avatar>
										<span>{result.submittedBy.nickname}</span>
									</div>
								</TableCell>
								<TableCell>{result.score}</TableCell>
								<TableCell>{result.submittedAt.toLocaleDateString()}</TableCell>
								<TableCell>
									<Badge
										variant={
											result.testCaseStatus === "all_passed"
												? "default"
												: result.testCaseStatus === "some_failed"
												? "secondary"
												: "destructive"
										}>
										{result.testCaseStatus.replace("_", " ")}
									</Badge>
								</TableCell>
							</TableRow>
						);
					})}
					{results.length === 0 && (
						<TableRow>
							<TableCell
								colSpan={5}
								className="text-center py-8 text-muted-foreground">
								No submissions yet. Be the first!
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}
