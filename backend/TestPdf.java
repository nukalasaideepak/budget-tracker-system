import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.element.Cell;
import java.io.ByteArrayOutputStream;

public class TestPdf {
    public static void main(String[] args) throws Exception {
        System.out.println("Starting PDF gen");
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);
        document.add(new Paragraph("BudgetWise Transactions Backup").setBold().setFontSize(18));
        float[] columnWidths = {50F, 100F, 80F, 100F, 80F, 80F, 100F};
        Table table = new Table(columnWidths);
        String[] headers = {"ID"};
        for (String header : headers) {
            table.addHeaderCell(new Cell().add(new Paragraph(header).setBold()));
        }
        document.add(table);
        document.close();
        System.out.println("Done PDF gen, size: " + baos.toByteArray().length);
    }
}
