import { Worker } from '@/types/Worker';
interface WorkerDetailsProps {
    worker: Worker;
    onUpdate: () => Promise<void>;
}
export default function WorkerDetails({ worker, onUpdate }: WorkerDetailsProps): import("react/jsx-runtime").JSX.Element;
export {};
