import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class LambdaExpressions {
    public static void main(String[] args) {

        List<String> names = new ArrayList<>();

        names.add("Selva");
        names.add("Anu");
        names.add("Priya");
        names.add("Kavi");

        Collections.sort(names, (a, b) -> a.compareTo(b));

        System.out.println("Sorted List:");
        for (String name : names) {
            System.out.println(name);
        }
    }
}