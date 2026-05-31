import java.io.*;
import java.net.*;

public class TCPChat {

    static class ServerThread extends Thread {
        public void run() {
            try {
                ServerSocket server = new ServerSocket(5000);
                System.out.println("Server is waiting...");

                Socket socket = server.accept();

                BufferedReader in = new BufferedReader(
                        new InputStreamReader(socket.getInputStream()));

                PrintWriter out = new PrintWriter(
                        socket.getOutputStream(), true);

                out.println("Hello from Server");
                System.out.println("Client says: " + in.readLine());

                socket.close();
                server.close();

            } catch (Exception e) {
                System.out.println(e);
            }
        }
    }

    static class ClientThread extends Thread {
        public void run() {
            try {
                Thread.sleep(1000);

                Socket socket = new Socket("localhost", 5000);

                BufferedReader in = new BufferedReader(
                        new InputStreamReader(socket.getInputStream()));

                PrintWriter out = new PrintWriter(
                        socket.getOutputStream(), true);

                System.out.println("Server says: " + in.readLine());

                out.println("Hello from Client");

                socket.close();

            } catch (Exception e) {
                System.out.println(e);
            }
        }
    }

    public static void main(String[] args) {

        ServerThread server = new ServerThread();
        ClientThread client = new ClientThread();

        server.start();
        client.start();
    }
}