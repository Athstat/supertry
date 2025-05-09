type Props = {
  filterAvailable: boolean;
  toogle: () => void;
};

export default function AvailableFilter({ filterAvailable, toogle }: Props) {
  return (
    <div className="dark:text-slate-300 mt-2 w-full items-center justify-start flex flex-row gap-2 px-2">
      <input
        className="h-5 w-5"
        checked={filterAvailable}
        onClick={toogle}
        type="checkbox"
      />
      <div className="p-0 m-0  h-fit">Show Available Players Only</div>
    </div>
  );
}
