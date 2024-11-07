import { useState } from "react";
import { cn, StateType, store, storeFunctions } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { motion } from "framer-motion";
import { CheckCheck, LayoutGrid, StretchHorizontal, X } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function TodoTabs(props: { tab: StateType["tab"] }) {
  const notes = store.useListen((e) => e.notes);
  const [grid, setGrid] = useState(true);
  const navigate = useNavigate();

  const filter = (type: StateType["tab"]) => {
    if (type == "complited") return notes.filter((e) => e.isComplited && e);

    if (type == "deleted") return notes.filter((e) => e.isDeleted && e);

    if (type == "current")
      return notes.filter((e) => !e.isComplited && !e.isDeleted && e);

    return notes;
  };

  return (
    <Tabs
      defaultValue={props.tab}
      className="relative flex flex-col gap-5 items-start"
    >
      <TabsList className=" gap-5  ">
        <TabsTrigger value="all" onClick={() => navigate("/")}>
          All
        </TabsTrigger>
        <TabsTrigger value="current" onClick={() => navigate("/current")}>
          in progress
        </TabsTrigger>
        <TabsTrigger value="complited" onClick={() => navigate("/complited")}>
          complited
        </TabsTrigger>
        <TabsTrigger value="deleted" onClick={() => navigate("/deleted")}>
          deleted
        </TabsTrigger>
      </TabsList>
      <div className="absolute top-0 right-0 ">
        {grid ? (
          <Button
            size="sm"
            className={cn("bg-black ", !grid && "opacity-50")}
            variant="secondary"
            onClick={() => setGrid(() => false)}
            disabled={!grid}
          >
            <LayoutGrid size={20} />
          </Button>
        ) : (
          <Button
            size="sm"
            className={cn("bg-black ", grid && "opacity-50")}
            variant="secondary"
            onClick={() => setGrid(() => true)}
            disabled={grid}
          >
            <StretchHorizontal size={20} />
          </Button>
        )}
      </div>

      <TodoList grid={grid} notes={filter("all")} value="all" />
      <TodoList grid={grid} notes={filter("current")} value="current" />
      <TodoList grid={grid} notes={filter("complited")} value="complited" />
      <TodoList grid={grid} notes={filter("deleted")} value="deleted" />
    </Tabs>
  );
}

const TodoList = (props: {
  notes: StateType["notes"];
  value: string;
  grid: boolean;
}) => {
  const onComplite = (id: number) => (
    storeFunctions.setOnComplited(id),
    toast({
      title: "Note set Complited",
      description: "you can check it on complited tab",
    })
  );

  const remove = (id: number) => (
    storeFunctions.setDeleted(id),
    toast({
      title: "Note deleted",
      description: "you can check it on deleted tab",
    })
  );

  return (
    <TabsContent value={props.value} className="w-full">
      <div
        className={cn(
          "w-full border-[1px] border-zinc-700 rounded-md p-5 gap-5 grid",
          !props.grid ? "grid-cols-2" : "grid-cols-1"
        )}
      >
        {props.notes.map((e, i) => (
          <div
            key={i}
            className="flex flex-col gap-5 p-4 rounded-md bg-zinc-800 "
          >
            <motion.span className="overflow-hidden max-h-52 ">
              {e.content}
            </motion.span>
            {!e.isDeleted && (
              <div className="h-auto w-full flex gap-2 overflow-hidden">
                {!e.isComplited && (
                  <Button
                    onClick={() => onComplite(e.id)}
                    className="mt-5 !bg-blue-800 !text-white"
                  >
                    <CheckCheck />
                  </Button>
                )}
                <Button
                  onClick={() => remove(e.id)}
                  className="mt-5 !bg-red-700 !text-white"
                >
                  <X />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </TabsContent>
  );
};
