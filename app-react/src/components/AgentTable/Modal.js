import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  IconButton,
  Typography,
  Input,
  MenuItem,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
 
export default function AgentModal({open, handleOpen, handleAdd}) {

  const [activitykey, setActivitykey] = useState('');
  const [agents, setAgents] = useState(0);

  return (
    <Dialog size="xs" open={open} handler={handleOpen}>
      <DialogHeader className="justify-between">
        <Typography variant="h5" color="blue-gray">
          Add Agent
        </Typography>
        <IconButton
          color="blue-gray"
          size="sm"
          variant="text"
          onClick={handleOpen}
        >
          <XMarkIcon strokeWidth={2} className="h-5 w-5" />
        </IconButton>
      </DialogHeader>
      <DialogBody className="overflow-y-scroll pr-2">
        <div className="mb-4 flex flex-col gap-6">
          <Input size="lg" label="Activity key" value={activitykey} onChange={(e) => { setActivitykey(e.target.value) }}/>
          <Input type="number" label="Agents" min={0} onChange={(e) => { setAgents(Number(e.target.value)) }}/>
        </div>
      </DialogBody>
      <DialogFooter className="justify-between gap-2 border-t border-blue-gray-50">
        <Typography variant="small" color="gray" className="font-normal">
          Are you sure to add new agent?
        </Typography>
        <Button variant="text" size="sm" onClick={() => { handleAdd(activitykey, agents, new Date()) }}>
          Add Agent
        </Button>
      </DialogFooter>
    </Dialog>
  );
}