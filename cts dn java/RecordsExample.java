import java.util.List;

record Person(String name, int age) {}

public class RecordsExample {
    public static void main(String[] args) {

        List<Person> people = List.of(
                new Person("Selva", 20),
                new Person("Anu", 17),
                new Person("Priya", 22)
        );

        System.out.println("All Persons:");
        people.forEach(System.out::println);

        System.out.println("\nAge >= 18:");

        people.stream()
              .filter(p -> p.age() >= 18)
              .forEach(System.out::println);
    }
}