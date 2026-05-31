import java.util.Scanner;
class Calculator 
{
    public static void main(String[]args)
    {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        System.out.println("the first operation is addition");
        System.out.println("the second operation is subtraction");
        System.out.println("the third operation is multiplication");
        System.out.println("the fourth operation is division");
        int choice = sc.nextInt();
        if(choice == 1)
        {
            System.out.println("result"+(a+b));
        }
        else if(choice == 2)
        {
            System.out.println("result"+(a-b));
        }
        else if(choice == 3)
        {
            System.out.println("result"+(a*b));
        }
        else if(choice == 4)
        {
            System.out.println("result"+(a/b));
        }

    }
}