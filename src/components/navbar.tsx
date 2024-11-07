import { Button } from "./ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Eraser, Save } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { cn, storeFunctions } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

export default function Navbar() {
  const [note, setNote] = useState("");

  const clear = () => setNote("");

  const save = () => {
    storeFunctions.addTodo(note);
    clear();
    toast({
      title: "Note saved",
      description: "Scroll down to check your note",
    });
  };

  return (
    <motion.div
      animate={{
        padding: note.length > 0 ? "20px" : "0px",
      }}
      className="w-full border-[1px] border-zinc-700 flex  rounded-md flex-col overflow-hidden h-auto"
    >
      <Textarea
        rows={10}
        className={cn(
          "w-full dark:bg-transparent border-zinc-700 ",
          note.length == 0 && "!border-none"
        )}
        placeholder="start typing here"
        value={note}
        onChange={({ target: { value } }) => setNote(value)}
      />
      <AnimatePresence>
        {note.length > 0 && (
          <motion.div
            initial={{ height: "0px", opacity: 0 }}
            exit={{ height: "0px", opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="h-auto w-full flex gap-5 overflow-hidden"
          >
            <Button onClick={save} className="mt-5">
              <Save size={16} />
              add
            </Button>
            <Button onClick={clear} variant="destructive" className="mt-5">
              <Eraser /> clear
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
