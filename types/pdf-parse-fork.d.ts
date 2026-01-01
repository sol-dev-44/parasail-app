declare module 'pdf-parse-fork' {
    interface PDFData {
        text: string;
        numpages: number;
        numrender: number;
        info: any;
        metadata: any;
        version: string;
    }

    function pdfParse(dataBuffer: Buffer, options?: any): Promise<PDFData>;
    export default pdfParse;
}
