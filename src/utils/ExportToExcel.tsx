import * as XLSX from "xlsx"
import { saveAs } from "file-saver"

type ExportConfig<T> = {
  data: T[]
  fileName?: string
  sheetName?: string
  mapFn?: (item: T) => Record<string, any>
}

export function ExportToExcel<T>({
  data,
  fileName = "data.xlsx",
  sheetName = "Sheet1",
  mapFn,
}: ExportConfig<T>) {
  // Si hay función de mapeo, la usa
  const finalData = mapFn ? data.map(mapFn) : data

  const worksheet = XLSX.utils.json_to_sheet(finalData)
  const workbook = XLSX.utils.book_new()

  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  })

  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  })

  saveAs(blob, fileName)
}