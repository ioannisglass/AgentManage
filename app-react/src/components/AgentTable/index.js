import { MagnifyingGlassIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { PencilIcon, ArrowsRightLeftIcon, TrashIcon } from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Avatar,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import { useState } from "react";
import AgentModal from "./Modal";
import SubTable from "./SubTable";
import GrandSubTable from "./GrandSubTable";
 

const TABLE_HEAD = ["Activity key", "Agents", "Date", "Actions"];
 
const TABLE_ROWS = [
  {
    actkey: 'agent1',
    agents: 1,
    date: new Date(2023, 4, 5),
    enabled: true
  },
  {
    actkey: 'agent2',
    agents: 5,
    date: new Date(2023, 6, 15),
    enabled: true
  },
  {
    actkey: 'agent3',
    agents: 2,
    date: new Date(2023, 3, 5),
    enabled: true
  },
  {
    actkey: 'agent4',
    agents: 4,
    date: new Date(2023, 1, 12),
    enabled: true
  },
  {
    actkey: 'agent5',
    agents: 3,
    date: new Date(2023, 12, 10),
    enabled: true
  },
  {
    actkey: 'agent6',
    agents: 3,
    date: new Date(2023, 12, 10),
    enabled: true
  },
  {
    actkey: 'agent7',
    agents: 3,
    date: new Date(2023, 12, 10),
    enabled: true
  },
  {
    actkey: 'agent8',
    agents: 3,
    date: new Date(2023, 12, 10),
    enabled: true
  },
];
 
export default function CustomAgentTable() {

    const [tableData, setTableData] = useState(TABLE_ROWS);
    const [modalOpen, setModalOpen] = useState(false);
    const [subMode, setSubMode] = useState(0);

    const handleOpen = () => {
        setModalOpen(!modalOpen);
    }

    const handleMode = (mode) => {
        setSubMode(mode)
    }

    const handleAdd = (actkey, agents, date) => {
        let customTableData = [...tableData, { actkey: actkey, agents: agents, date: date, enabled: true }]
        setTableData(customTableData);
        setModalOpen(!modalOpen);
    }

    const handleStateChange = (index) => {
        let customTableData = [...tableData];
        customTableData[index].enabled = !customTableData[index].enabled;
        setTableData(customTableData);
    }

    const removeItemAt = (index) => {
        setTableData(tableData.filter((_, i) => i != index))
    }

    return (
    <>
        {
            subMode == 0 &&
            <>
            <Card className="h-full w-full">
            <CardHeader floated={false} shadow={false} className="rounded-none">
                <div className="flex items-center justify-between">
                <div>
                    <Typography variant="h5" color="blue-gray">
                    Agents List
                    </Typography>
                </div>
                <Button onClick={handleOpen}>
                    Add Agent
                </Button>
                </div>
            </CardHeader>
            <CardBody className="overflow-hide px-0">
                <table className="w-full min-w-max table-auto text-left">
                <thead>
                    <tr>
                    {TABLE_HEAD.map((head, index) => (
                        <th
                        key={head}
                        className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                        >
                        <Typography
                            variant="small"
                            color="blue-gray"
                            className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                        >
                            {head}{" "}
                            {index !== TABLE_HEAD.length - 1 && (
                            <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
                            )}
                        </Typography>
                        </th>
                    ))}
                    </tr>
                </thead>
                <tbody>
                    {tableData.map(({ actkey, agents, date, enabled }, index) => {
                    const isLast = index === tableData.length - 1;
                    const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                    return (
                        <tr key={actkey}>
                        <td className={classes}   onClick={() => { setSubMode(1) }}>
                            <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                                <Typography variant="small" color="blue-gray" className="font-normal">
                                {actkey}
                                </Typography>
                            </div>
                            </div>
                        </td>
                        <td className={classes}>
                            <div className="flex flex-col">
                            <Typography variant="small" color="blue-gray" className="font-normal">
                                {agents}
                            </Typography>
                            </div>
                        </td>
                        <td className={classes}>
                            <Typography variant="small" color="blue-gray" className="font-normal">
                            {date.toISOString().slice(0, 10).replace(/-/g, ".")}
                            </Typography>
                        </td>
                        <td className={classes}>
                            <div className="flex flex-row">
                                {   
                                    enabled ?
                                    <Chip
                                        variant="ghost"
                                        color="green"
                                        size="sm"
                                        value="Enabled"
                                        icon={<span className="content-[''] block w-2 h-2 rounded-full mx-auto mt-1 bg-green-900" />}
                                    />
                                            :
                                    <Chip
                                        variant="ghost"
                                        color="red"
                                        size="sm"
                                        value="Disabled"
                                        icon={<span className="content-[''] block w-2 h-2 rounded-full mx-auto mt-1 bg-red-900" />}
                                    />
                                }

                                <Tooltip content="Enable / Disable">
                                    <IconButton variant="text" color="blue-gray" onClick={() => handleStateChange(index)}>
                                        <ArrowsRightLeftIcon className="h-4 w-4" />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip content="Remove">
                                    <IconButton variant="text" color="blue-gray" onClick={() => removeItemAt(index)}>
                                        <TrashIcon className="h-4 w-4" />
                                    </IconButton>
                                </Tooltip>
                            </div>
                        </td>
                        </tr>
                    );
                    })}
                </tbody>
                </table>
            </CardBody>
            </Card>
            <AgentModal open={modalOpen} handleOpen={handleOpen} handleAdd={handleAdd}>
            </AgentModal>
            </>
        }
        {
            subMode == 1 &&
            <SubTable handleMode = {handleMode}></SubTable>
        }
        {
            subMode == 2 &&
            <GrandSubTable handleMode = {handleMode}></GrandSubTable>
        }
    </>
    );
}