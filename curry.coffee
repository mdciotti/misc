curry = do ->
  slice = Array.prototype.slice
  makeFn = (fn, arity, reverse, prevArgs) ->
    return ->
      newArgs = slice.call arguments, 0
      args = prevArgs.concat newArgs
      if args.length < arity
        return makeFn fn, arity, reverse, args
      else
        return fn.apply null, if reverse then do args.reverse else args
  return (fn, arity, reverse) ->
    return makeFn fn, arity or fn.length, reverse, []

f = curry (a, b, c) -> a*a + b*b + c*c

(console.log (((f 1) 2) 4), f(1, 2, 4))
