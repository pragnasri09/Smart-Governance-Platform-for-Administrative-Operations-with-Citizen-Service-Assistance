package in.gov.sgp.controller;
import in.gov.sgp.dto.Dtos.ErrorResponse; import in.gov.sgp.service.GovernanceService.*; import org.springframework.dao.DataIntegrityViolationException; import org.springframework.http.*; import org.springframework.http.converter.HttpMessageNotReadableException; import org.springframework.web.bind.MethodArgumentNotValidException; import org.springframework.web.bind.annotation.*; import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
@RestControllerAdvice public class ApiExceptionHandler {
 @ExceptionHandler(MethodArgumentNotValidException.class) ResponseEntity<ErrorResponse> validation(Exception e){return ResponseEntity.badRequest().body(new ErrorResponse("Please check the submitted details and try again."));}
 @ExceptionHandler(MethodArgumentTypeMismatchException.class) ResponseEntity<ErrorResponse> type(Exception e){return ResponseEntity.badRequest().body(new ErrorResponse("Invalid request parameters."));}
 @ExceptionHandler(DuplicateException.class) ResponseEntity<ErrorResponse> duplicate(DuplicateException e){return ResponseEntity.status(409).body(new ErrorResponse(e.getMessage()));}
 @ExceptionHandler(HttpMessageNotReadableException.class) ResponseEntity<ErrorResponse> unreadable(){return ResponseEntity.badRequest().body(new ErrorResponse("Please check the submitted details and try again."));}
 @ExceptionHandler(UnauthorizedException.class) ResponseEntity<ErrorResponse> unauthorized(UnauthorizedException e){return ResponseEntity.status(401).body(new ErrorResponse(e.getMessage()));}
 @ExceptionHandler(ForbiddenException.class) ResponseEntity<ErrorResponse> forbidden(ForbiddenException e){return ResponseEntity.status(403).body(new ErrorResponse(e.getMessage()));}
 @ExceptionHandler(NotFoundException.class) ResponseEntity<ErrorResponse> notFound(NotFoundException e){return ResponseEntity.status(404).body(new ErrorResponse(e.getMessage()));}
 @ExceptionHandler(IllegalArgumentException.class) ResponseEntity<ErrorResponse> bad(IllegalArgumentException e){return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));}
 @ExceptionHandler(DataIntegrityViolationException.class) ResponseEntity<ErrorResponse> conflict(){return ResponseEntity.status(409).body(new ErrorResponse("The request conflicts with existing data."));}
}
