import { useState } from "react";
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

const TABLE_HEAD = ["No", "Agent", "Version"];
 
const TABLE_ROWS = [
  {
    actkey: '1',
    agents: 'asd',
    date: new Date(2023, 4, 5),
    enabled: true
  },
  {
    actkey: '2',
    agents: 'sdf',
    date: new Date(2023, 4, 5),
    enabled: true
  },
  {
    actkey: '3',
    agents: 'efw',
    date: new Date(2023, 4, 5),
    enabled: true
  },
];

export default function GrandSubTable({handleMode}) {

    const [tableData, setTableData] = useState(TABLE_ROWS);

    return (
        <>
            <Card className="h-full w-full">
            <CardHeader floated={false} shadow={false} className="rounded-none">
                <div className="flex items-center justify-between">
                <div>
                    <Typography variant="h5" color="blue-gray">
                    Last List
                    </Typography>
                </div>
                <Button  onClick={() => { handleMode(1) }}>
                    Go Back
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
                        <td className={classes}>
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
                            <div className="flex flex-col">
                            <Typography variant="small" color="blue-gray" className="font-normal">
                                {agents}
                            </Typography>
                            </div>
                        </td>
                        </tr>
                    );
                    })}
                </tbody>
                </table>
            </CardBody>
            </Card>
        </>
    );
}