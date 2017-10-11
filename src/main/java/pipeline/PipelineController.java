package pipeline;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class PipelineController {

    @RequestMapping("/pipelines")
    public String pipeline(@RequestParam(value="name", required=false, defaultValue="Pipeline IT Magix") String name, Model model) {
        model.addAttribute("name", name);
        return "pipeline";
    }

}
