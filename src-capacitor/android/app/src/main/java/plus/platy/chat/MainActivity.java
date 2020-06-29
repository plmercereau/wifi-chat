package plus.platy.chat;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;
// import plus.platy.enumeratemediadevices.EnumeratePlugin;

import java.util.ArrayList;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Initializes the Bridge
    this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {
      {
        // Additional plugins you've installed go here
        // Ex: add(TotallyAwesomePlugin.class);
        // TODO try to put this in the plugin, not in the project
        // add(EnumeratePlugin.class);
      }
    });

  }
}
