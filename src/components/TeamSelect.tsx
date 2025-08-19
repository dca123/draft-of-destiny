import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getRouteApi } from "@tanstack/react-router";

const route = getRouteApi("/drafts/$draftId");
export function TeamSelect() {
  const navigate = route.useNavigate();
  const { team } = route.useSearch();

  return (
    <div className="flex flex-col space-y-1">
      <label className="text-sm text-muted-foreground">Your Team</label>
      <Select
        onValueChange={(val: "team_1" | "team_2") => {
          navigate({ search: { team: val } });
        }}
        value={team}
      >
        <SelectTrigger className="w-[190px]">
          <SelectValue placeholder="Team" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="team_1">Team 1 (First Pick)</SelectItem>
          <SelectItem value="team_2">Team 2 (Second Pick)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
