import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;

public class TransactionHandling {

    static final String URL = "jdbc:mysql://localhost:3306/bankdb";
    static final String USER = "root";
    static final String PASSWORD = "root";

    public static void transferMoney(int fromId, int toId, double amount) {

        Connection con = null;

        try {
            con = DriverManager.getConnection(URL, USER, PASSWORD);

            con.setAutoCommit(false);

            String debitQuery =
                "UPDATE accounts SET balance = balance - ? WHERE id = ?";
            String creditQuery =
                "UPDATE accounts SET balance = balance + ? WHERE id = ?";

            PreparedStatement debit =
                con.prepareStatement(debitQuery);
            PreparedStatement credit =
                con.prepareStatement(creditQuery);

            debit.setDouble(1, amount);
            debit.setInt(2, fromId);

            credit.setDouble(1, amount);
            credit.setInt(2, toId);

            debit.executeUpdate();
            credit.executeUpdate();

            con.commit();

            System.out.println("Transaction Successful");

        } catch (Exception e) {

            try {
                if (con != null) {
                    con.rollback();
                    System.out.println("Transaction Rolled Back");
                }
            } catch (Exception ex) {
                System.out.println(ex);
            }

        } finally {

            try {
                if (con != null) {
                    con.close();
                }
            } catch (Exception e) {
                System.out.println(e);
            }
        }
    }

    public static void main(String[] args) {
        transferMoney(1, 2, 1000);
    }
}