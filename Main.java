import java.awt.Robot;
import java.awt.AWTException;
import java.awt.event.KeyEvent;

public class Main {
    public static void main(String[] args) throws AWTException {
        Robot r = new Robot();
        r.delay(5000);
        for (int i = 0; i < 622; i++) {
            r.keyPress(KeyEvent.VK_RIGHT);
            r.delay(100);
        }
    }
}