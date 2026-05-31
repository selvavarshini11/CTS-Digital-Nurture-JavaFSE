import java.lang.reflect.Method;

class Sample {

    public void display() {
        System.out.println("Hello from Reflection");
    }
}

public class ReflectionDemo {

    public static void main(String[] args) {

        try {
            Class<?> cls = Class.forName("Sample");

            System.out.println("Methods in Sample class:");

            Method[] methods = cls.getDeclaredMethods();

            for (Method m : methods) {
                System.out.println(m.getName());
            }

            Object obj = cls.getDeclaredConstructor().newInstance();

            Method method = cls.getDeclaredMethod("display");

            method.invoke(obj);

        } catch (Exception e) {
            System.out.println(e);
        }
    }
}