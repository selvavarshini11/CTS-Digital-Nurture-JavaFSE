import java.util.Scanner;
class Oddeven
{
    public static void main(String[]args)
    {
        Scanner sc = new Scanner(System.in);
        int num = sc.nextInt();
        if(num%2==0)
        {
            System.out.println("its is even");
        }
        else{
            System.out.println("it is odd");
        }
    }
}