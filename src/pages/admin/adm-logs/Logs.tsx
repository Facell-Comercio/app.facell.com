// import { useStoreTitulo } from "./store-titulo";

import { useLogs } from "@/hooks/useLogs";
import { addDays, isWithinInterval } from "date-fns";
import { useMemo, useState } from "react";
import FilterLogs from "./FiltersLogs";
import ModalLog from "./Modal";
import RowVirtualizedFixed, { Log } from "./RowVirtualizedFixed";
import { useStoreLogs } from "./store";

const Logs = () => {
  const [toogleRefetch, setToogleRefetch] = useState(false);
  const filters = useStoreLogs().filters;
  const id = useStoreLogs().id;
  const { data, isFetched, isLoading, isError, refetch } = useLogs().getAll();

  const filteredData: Log[] = useMemo(
    () =>
      data?.filter((data: Log) => {
        return (
          (parseInt(filters.level || "0") === 30
            ? data.level !== 50
            : data.level >= parseInt(filters.level || "0")) &&
          (!!filters.origin
            ? data.origin === String(filters.origin).toUpperCase()
            : true) &&
          (!!filters.module
            ? data.module === String(filters.module).toUpperCase()
            : true) &&
          (!!filters.method
            ? data.method === String(filters.method).toUpperCase()
            : true) &&
          (!!filters.range_data?.from
            ? isWithinInterval(new Date(data.date), {
                start: filters.range_data?.from,
                end: filters.range_data?.to
                  ? addDays(filters.range_data?.to, 1)
                  : addDays(filters.range_data?.from, 1),
              })
            : true)
        );
      }),
    [toogleRefetch, data]
  );

  return (
    <div className="flex flex-col gap-3">
      <FilterLogs
        refetch={() => {
          setToogleRefetch((state) => !state);
          refetch();
        }}
      />
      <RowVirtualizedFixed
        data={filteredData}
        isLoading={isLoading}
        isError={isError}
      />
      {isFetched && !isError && (
        <ModalLog
          //@ts-ignore vai funcionar
          data={
            filteredData.filter(
              (data: Log) => data.pid === parseInt(id || "0")
            )[0]
          }
        />
      )}
    </div>
  );
};

export default Logs;
