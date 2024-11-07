import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useNavigate } from "react-router-dom";
import { store, storeFunctions } from "@/lib/utils";
import { Eye, EyeOff, Loader } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Login() {
  const isValid = store.useListen((e) => e.isVerified);
  const [visible, setVisible] = useState(false);
  const [laoding, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    name: "",
    password: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!isValid) navigate("/login");
    navigate("/");
  }, [isValid]);

  const login = () => {
    setLoading(() => true);
    setTimeout(() => {
      const check = storeFunctions.isValid(credentials);
      setLoading(() => false);
      if (!check.isVerified)
        toast({
          variant: "destructive",
          title: "unvalid credentials",
          description: "please check your credentials and try again",
        });
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-5 max-w-xl w-full">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          className="!bg-zinc-800"
          value={credentials.name}
          onChange={({ target: { value } }) =>
            setCredentials((e) => ({ ...e, name: value }))
          }
          id="name"
          placeholder="Name"
        />
      </div>
      <div>
        <Label htmlFor="email">password</Label>
        <div className="w-full flex gap-2" id="password">
          <Input
            className="!bg-zinc-800"
            value={credentials.password}
            onChange={({ target: { value } }) =>
              setCredentials((e) => ({ ...e, password: value }))
            }
            type={visible ? "text" : "password"}
            placeholder="password"
          />
          <Button
            onClick={() => setVisible((e) => !e)}
            className="!bg-zinc-700 !text-white"
          >
            {visible ? <EyeOff /> : <Eye />}
          </Button>
        </div>
      </div>
      <Button
        onClick={login}
        className="!bg-blue-700 !text-white"
        disabled={laoding || !!!credentials.name || !!!credentials.password}
      >
        {laoding && <Loader className="animate-spin" />}
        Login
      </Button>
    </div>
  );
}
