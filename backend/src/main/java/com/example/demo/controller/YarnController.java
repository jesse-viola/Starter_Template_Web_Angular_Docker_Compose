import com.example.demo.entity.Yarn;
import com.example.demo.repository.YarnRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class YarnController {

    @Autowired
    private YarnRepository yarnRepository;

    @GetMapping("/yarns")
    public ResponseEntity<List<Yarn>> getAllItems() {
        List<Yarn> yarns = yarnRepository.findAll();
        return ResponseEntity.ok(yarns);
    }

}